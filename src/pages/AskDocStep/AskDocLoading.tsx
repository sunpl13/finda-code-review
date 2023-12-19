import { useEffect } from 'react';
import CheckDocHistorySkeleton from '../../components/askDoc/CheckDocHistorySkeleton';
import { useNavigate } from 'react-router-dom';
import { WrapperPage } from '../../style/askDoc';
import useGetAskDocFiles, { Data } from '../../components/hooks/useGetAskDocFiles';
export const FallbackComponent = () => {
  return (
    <WrapperPage>
      <CheckDocHistorySkeleton />
    </WrapperPage>
  );
};

const AskDocLoading = () => {
  const navigate = useNavigate();
  const { data } = useGetAskDocFiles();

  useEffect(
    function movePageBasedOnStatus() {
      // 문서 편집 기록이 없는 경우
      const movePage = (data: Data) => {
        if (data.resultCode === 0 && data.fileRevision === data.maxFileRevision) {
          if (data.status === 'AVAILABLE') return navigate('/AskDocStep/Chat');
          if (data.status === 'TEXT_DONE') return navigate('/AskDocStep/StartAnalysisDoc');
          if (data.status === null) return navigate('/AskDocStep/ConfirmDoc');
          return navigate('/AskDocStep/ProgressAnalysisDoc');
        }
        return navigate('/AskDocStep/CheckDocHistory');
      };
      if (data) {
        movePage(data);
      }
    },
    [data, navigate]
  );

  return <FallbackComponent />;
};

export default AskDocLoading;
