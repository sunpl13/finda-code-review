import { useEffect, Dispatch, SetStateAction } from 'react';
import ProgressBar from '../../ProgressBar';

import { ASKDOC_MAKE_SUMMARY } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import usePercentage from '../../hooks/usePercentage';
import { useAppDispatch } from '../../../store/store';
import { setSummary } from '../../../store/slices/askDocSummary';
import useAskDocErrorHandler from '../../hooks/useAskDocErrorHandler';
import useAskDocRequestHandler from '../../hooks/useAskDocRequestHandler';
type Props = {
  onNext: Dispatch<SetStateAction<'ready' | IFileStatus>>;
};

const Keyword = ({ onNext }: Props) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAskDocRequestHandler(ASKDOC_MAKE_SUMMARY);
  const { percentage } = usePercentage(isLoading, data?.code === 'success', 45, 90, 500);
  const askdocErrorHandle = useAskDocErrorHandler();
  askdocErrorHandle(data);

  useEffect(() => {
    if (!isLoading && data?.code === 'success' && percentage === 90) {
      dispatch(
        setSummary({
          keywords: data.data.keywords,
          questions: data.data.questions,
          summary: data.data.summary
        })
      );

      onNext('DOCINFO_DONE');
    }
  }, [isLoading, data, onNext, percentage]);

  return <ProgressBar progressPer={percentage} />;
};

export default Keyword;
