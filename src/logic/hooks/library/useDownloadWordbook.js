import { useContext, useState, useRef, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { downloadWordbook } from '../../../data/api/downloadWordbook';

import { createBook, getWordbookById } from '../../../data/dao/bookDao';
import { insertWords } from '../../../data/dao/wordBookMappingDao';

import { syncWordStatus } from '../../../data/repository/syncWordStatus';

import { AuthContext } from '../../contexts/AuthContext';
import { PracticeWordbookContext } from '../../contexts/PracticeWordbookContext';

import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

export function useDownloadWordbook(navigation) {
  const { authFetch } = useContext(AuthContext);
  const { savePracticeWordbook, practiceWordbook } = useContext(
    PracticeWordbookContext,
  );
  const [downloading, setDownloading] = useState(false);

  const canceledRef = useRef(false);
  const isMounted = useRef(true);

  const { showAlert, hideAlert } = useCustomAlert();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onDownloadAction = useCallback(
    async book => {
      if (downloading) return;

      try {
        canceledRef.current = false;
        setDownloading(true);

        showAlert({
          title: '下载词书',
          content: '正在处理词书，请稍后',
          buttons: [
            {
              text: '取消',
              onPress: () => {
                canceledRef.current = true;
                if (isMounted.current) setDownloading(false);
                hideAlert();
              },
            },
          ],
          type: 'center',
        });

        // 检查本地是否已存在
        let exists = false;
        try {
          exists = await getWordbookById(book._id);
        } catch (dbErr) {
          console.warn('查询本地词书失败，将尝试重新下载:', dbErr);
        }

        if (!exists) {
          const { ok, result } = await downloadWordbook(authFetch, book._id);

          if (canceledRef.current) return;

          if (!ok) {
            showAlert({
              title: '下载失败',
              content: '网络错误或词书不存在，请稍后再试',
              buttons: [{ text: '确定' }],
              type: 'center',
            });
            return;
          }

          // 数据库存储
          try {
            await syncWordStatus(result); // 同步进度
            await insertWords(result); // 插入单词
            await createBook(book); // 创建书本索引
          } catch (err) {
            console.error('存储过程出错:', err);
            showAlert({
              title: '保存失败',
              content: '本地数据库写入失败',
              buttons: [{ text: '确定' }],
              type: 'center',
            });
            return;
          }
        }

        if (canceledRef.current) return;

        // 更新 AsyncStorage 的当前显示词书
        const displayWordbookStr = await AsyncStorage.getItem(
          'displayWordbook',
        );
        const displayWordbook = displayWordbookStr
          ? JSON.parse(displayWordbookStr)
          : null;

        if (displayWordbook?._id === practiceWordbook?._id) {
          await AsyncStorage.setItem('displayWordbook', JSON.stringify(book));
        }

        savePracticeWordbook(book);
        hideAlert();

        navigation.navigate('HomeStackNavigator', {
          screen: 'HomeScreen',
          params: { book },
        });
      } catch (globalErr) {
        console.error('下载流程全局异常:', globalErr);
        hideAlert();
      } finally {
        if (isMounted.current) {
          setDownloading(false);
        }
      }
    },
    [
      authFetch,
      navigation,
      practiceWordbook,
      savePracticeWordbook,
      downloading,
      showAlert,
      hideAlert,
    ],
  );

  return {
    onDownloadAction,
  };
}
