import { openModal, closeModal } from '../../store/slices/askDocModalsSlice';
import { useAppDispatch } from '../../store/store';

type ModalType =
  | 'overpage'
  | 'remine'
  | 'samefile'
  | 'upgrade'
  | 'analyzefail'
  | 'uploadfail'
  | 'lackOfCredit'
  | 'default';

type OpenModalType = {
  type: ModalType;
  props: any;
};

function useModal() {
  const dispatch = useAppDispatch();

  const handleOpenModal = ({ type, props }: OpenModalType) => {
    dispatch(openModal({ type, props }));
  };

  const handleCloseModal = (type: ModalType) => {
    dispatch(closeModal());
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}

export default useModal;
