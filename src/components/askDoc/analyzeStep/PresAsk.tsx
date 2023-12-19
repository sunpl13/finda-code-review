import { useEffect, Dispatch, SetStateAction } from 'react';
import ProgressBar from '../../ProgressBar';
import useAskDocRequestHandler from '../../hooks/useAskDocRequestHandler';
import { ASKDOC_ALL_COMPLETE_ANALYZING } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import usePercentage from '../../hooks/usePercentage';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../store/store';
import { activeToast } from '../../../store/slices/toastSlice';
import useAskDocErrorHandler from '../../hooks/useAskDocErrorHandler';
import { useTranslation } from 'react-i18next';
import { setCreating } from '../../../store/slices/tabSlice';

type Props = {
  onNext: Dispatch<SetStateAction<'ready' | IFileStatus>>;
};

const PreAsk = ({ onNext }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data, isLoading, isSuccess } = useAskDocRequestHandler(ASKDOC_ALL_COMPLETE_ANALYZING);
  const { percentage } = usePercentage(isLoading, data?.code === 'success', 90, 100, 500);
  const askdocErrorHandle = useAskDocErrorHandler();
  askdocErrorHandle(data);

  useEffect(() => {
    if (!isLoading && data?.code === 'success' && percentage === 100) {
      dispatch(setCreating('PreAsk'));
      dispatch(
        activeToast({
          type: 'info',
          msg: t(`ToastMsg.StartCreating`, {
            deductionCredit: 5,
            leftCredit: data.data.credit === '-1' ? t('Unlimited') : data.data.credit
          })
        })
      );
      navigate('/AskDocStep/Chat');
      dispatch(setCreating('none'));
    }
  }, [isLoading, data, onNext, percentage, navigate, isSuccess]);
  return <ProgressBar progressPer={percentage} />;
};

export default PreAsk;
