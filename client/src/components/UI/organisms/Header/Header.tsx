import styles from './header.module.scss';
import classNames from 'classnames/bind';
import { GlobalMenu } from '../../molecules';
import UtilityMenu from '../UtilityMenu/UtilityMenu';
import { Button, Icon, Logo, Text } from '../../atoms';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { setHeader } from '../../../../redux/HeaderSlice';
import { auth, getMusicData } from '../../../../firebase/firebase';
import { setUserInfo, initializeState } from '../../../../redux/PostSlice';
import { toast } from 'react-toastify';
import React from 'react';

const Header = () => {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerState = useSelector(
    (state: RootState) => state.postHeader.isPost
  );
  const data = useSelector((state: RootState) => state.postInfo);
  const pdf = useSelector((state: RootState) => state.pdfFile);

  const handleIsPost = () => {
    dispatch(setHeader(false));
    dispatch(initializeState());
    navigate(-1);
  };

  if (auth.currentUser) {
    const user = [
      auth.currentUser.displayName,
      auth.currentUser.uid,
      auth.currentUser.photoURL,
    ];
    dispatch(setUserInfo(user));
  }
  const validateInputs = () => {
    const { songName, artist, albumImg, scores } = data;
    if (
      !songName ||
      !artist ||
      !albumImg ||
      !scores[0].instType ||
      !scores[0].difficulty ||
      !scores[0].sheetType ||
      !scores[0].detail ||
      !scores[0].price ||
      !pdf
    ) {
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateInputs()) {
      toast.error('모든 필드를 입력해주세요.');
    } else {
      await getMusicData(data.songName, data).then(() => navigate('/'));
      dispatch(setHeader(false));
      dispatch(initializeState());
      toast.success('악보 등록 성공!');
    }
  };

  if (headerState) {
    return (
      <header>
        <nav className={cx('nav-post')}>
          <Button size="s" theme="transparent" onClick={() => handleIsPost()}>
            <div className={cx('upload')}>
              <Icon icon="BsArrowLeft" />
              <Text>뒤로 가기</Text>
            </div>
          </Button>
          <Button size="s" onClick={() => handleUpload()}>
            <div className={cx('save')}>
              <Icon icon="MdOutlineCheck" color="white" />
              <Text color="white">저장하기</Text>
            </div>
          </Button>
        </nav>
      </header>
    );
  } else
    return (
      <header>
        <nav>
          <Logo type="pc" />
          <GlobalMenu />
          {localStorage.getItem('authorization') ? (
            <div className={cx('utility-menu')}>
              <UtilityMenu />
            </div>
          ) : (
            <div className={cx('login-button')}>
              <Button size="xs" onClick={() => navigate('/auth')}>
                <Text color="white">로그인</Text>
              </Button>
            </div>
          )}
        </nav>
      </header>
    );
};

export default React.memo(Header);
