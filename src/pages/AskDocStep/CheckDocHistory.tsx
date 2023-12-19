import { Wrapper, GuideMessage, Footer } from '../../style/askDoc';
import AskDocButton from '../../components/buttons/AskDocButton';
import { useTranslation } from 'react-i18next';
//import useModal from '../../components/hooks/useModal';
import { useState } from 'react';
import CheckBox from '../../components/CheckBox';
import styled from 'styled-components';
import { alignItemCenter, flex, flexColumn, justiStart } from '../../style/cssCommon';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';

type File = {
  fileId: string;
  fileRevision: number;
  fileName: string;
};

export type AskDocContext = {
  files: File[];
  data: any;
};

export const CheckDocHistory = () => {
  const { t } = useTranslation();
  // const { openModal, closeModal } = useModal();
  const navigator = useNavigate();
  const { files, maxFileRevision, isLoading, isSuccsess, fileStatus, userId, isInitialized } =
    useAppSelector(filesSelector);
  const dispatch = useAppDispatch();
  const fileExtArr = files[0].fileName.split('.');
  const fileExt = fileExtArr[fileExtArr.length - 1];
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleClick = () => {
    //선택한 문서를 다시 분석하는 경우
    if (isChecked) {
      dispatch(
        setFiles({
          isLoading,
          isInitialized,
          isSuccsess,
          userId,
          fileStatus: null,
          files: [
            {
              ...files[0],
              fileRevision: maxFileRevision as number
            }
          ]
        })
      );

      return navigator('/AskDocStep/ConfirmDoc');
    } else {
      if (fileStatus === 'AVAILABLE') return navigator('/AskDocStep/Chat');
      if (fileStatus === 'TEXT_DONE') return navigator('/AskDocStep/StartAnalysisDoc');
      if (fileStatus === null) return navigator('/AskDocStep/ConfirmDoc');
      return navigator('/AskDocStep/ProgressAnalysisDoc');
    }
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Wrapper background={false}>
      <GuideMessage>
        <h1>{t('AskDocStep.Step1.MainText')}</h1>
        <p>{t('AskDocStep.Step1.SubText')}</p>
      </GuideMessage>
      <List>
        {files.map((data) => {
          return (
            <Item checked={isChecked} key={data.fileId}>
              <Logo
                src={`${process.env.REACT_APP_PO_API}/web/maxage1/common/img/v4/${fileExt}.svg`}
                alt="logo"
              />
              <Text id={`files-${data.fileId}`}>
                {/*<span>{data.ext}</span>*/}
                {data.fileName}
              </Text>
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} onClick={handleCheck} />
            </Item>
          );
        })}
      </List>
      <Footer>
        <AskDocButton
          onClick={handleClick}
          text={
            isChecked
              ? t('AskDocStep.Step1.ButtonTextChecked')
              : t('AskDocStep.Step1.ButtonTextUnChecked')
          }
          isActive={isChecked}
        />
      </Footer>
    </Wrapper>
  );
};

export default CheckDocHistory;

const List = styled.ul`
  ${flex}
  ${flexColumn}
  ${justiStart}
  
  width: 100%;
  height: 100%;
  padding: 40px 0 0 0;
`;

const Item = styled.li<{ checked: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${justiStart}
  flex-direction: row;
  gap: 8px;

  width: 100%;
  padding: 12px 24px;
  margin: 0;
  background-color: ${(props) => (props.checked ? '#ede5fe' : 'none')};
`;

const Logo = styled.img`
  width: 22px;
  height: 28px;
`;

const Text = styled.div`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  span {
    height: 100%;
    float: right;
    display: flex;
    align-items: flex-end;
    line-height: 21px;
    shape-outside: inset(calc(100% - 24px) 0 0 0);
  }
`;
