import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { ASKDOC_GET_EXTRACT_TEXT_STATUS, ASKDOC_EXTRACT_TEXT } from '../../api/constant';
import Bridge from '../../util/bridge';
import useModal from './useModal';
import { setCreating } from '../../store/slices/tabSlice';
import useErrorHandle from './useErrorHandle';
import { requestHandler } from '../../api/askdocRequestHandler';
import useAskDocRequestHandler from './useAskDocRequestHandler';
const usePollingExtractText = () => {
  const timerIdRef = useRef<any>(null);
  const { openModal, closeModal } = useModal();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { data, isLoading } = useAskDocRequestHandler(ASKDOC_EXTRACT_TEXT);
  const [isSuccess, setIsSuccess] = useState(true);
  const { files, userId } = useAppSelector(filesSelector);

  useEffect(() => {
    const pollingCallback = async () => {
      let fail = false;
      // Your polling logic here
      try {
        dispatch(setCreating('TextExtract'));
        const { resultCode, status } = await requestHandler(ASKDOC_GET_EXTRACT_TEXT_STATUS, {
          taskId: data.data.taskId
        });
        if (resultCode === 0) {
          if (status === 'completed') {
            dispatch(
              setFiles({
                userId,
                isLoading: false,
                isSuccsess: true,
                files: [...files],
                fileStatus: 'TEXT_DONE',
                isInitialized: true
              })
            );
            dispatch(setCreating('none'));
            setIsPollingEnabled(false);
          }
        } else {
          let type:
            | 'overpage'
            | 'remine'
            | 'samefile'
            | 'upgrade'
            | 'analyzefail'
            | 'uploadfail'
            | 'default' = 'default';
          if (resultCode === 15302) type = 'remine';
          if (resultCode === 15303) type = 'overpage';

          openModal({
            type,
            props: {
              buttonOnclick: () => {
                closeModal(type);
                dispatch(setCreating('none'));
                dispatch(
                  setFiles({
                    isLoading: true,
                    files: [],
                    userId: '',
                    isSuccsess: false,
                    fileStatus: null,
                    maxFileRevision: 0,
                    isInitialized: true
                  })
                );
                Bridge.callBridgeApi('closePanel', 'shutDown');
              }
            }
          });
          setIsSuccess(false);
          setIsPollingEnabled(false);
        }
      } catch (error: any) {
        fail = true;
        setIsPollingEnabled(false);
        errorHandle(error);
      } finally {
        dispatch(setCreating('none'));
      }

      if (fail) {
        console.log('Polling failed. Stopped polling.');
      }
    };

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 1 seconds
      timerIdRef.current = setInterval(pollingCallback, 1000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPollingEnabled && data?.code === 'success') {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPollingEnabled, isLoading]);

  return {
    data,
    isSuccess: !isPollingEnabled && data.code === 'success' && isSuccess,
    isLoading: isPollingEnabled
  };
};

export default usePollingExtractText;
