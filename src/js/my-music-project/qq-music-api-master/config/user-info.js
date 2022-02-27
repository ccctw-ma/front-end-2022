/*
 * @Author: Rainy [https://github.com/rain120]
 * @Date: 2021-01-23 15:38:31
 * @LastEditors: Rainy
 * @LastEditTime: 2021-06-19 22:25:49
 */

const userInfo = {
  loginUin: '1934202608@qq.com',
  cookie: 'pgv_pvi=9398188032; RK=3yQw6tf9af; ptcz=270e8eb21f0098dced135752cd7f06462a7b374eade1f41b0fc65d5588ba5711; tvfe_boss_uuid=b2b39269e0580fac; o_cookie=1934202608; pac_uid=1_1934202608;  XWINDEXGREY=0; iip=0; mobileUV=1_176b109aad0_abd49; LW_sid=Q1U6S1E47266O7a8a4V366y2b1; LW_uid=11z6X1u4u2s6V7o8s4v3k692E5; fqm_pvqid=a43aa0dd-8e36-420d-a6e8-4697e8eda4f4; ptui_loginuin=1934202608; sd_userid=97201624085454379; sd_cookie_crttime=1624085454379; pgv_pvid=3446106572; eas_sid=51V603E6E7P2B9F1t3o0v2Y640; pt_sms_phone=136******77; fqm_sessionid=08a65fb4-b6b5-4451-bb25-eb713ff13c05; pgv_info=ssid=s3824517310; ts_refer=www.baidu.com/link; ts_uid=3155412938; _qpsvr_localtk=0.7732149815664515; login_type=1; qm_keyst=Q_H_L_20i-C860eC7SNHfPD8sUUbmMd1Xyr5xy7gp0SLwl-mDa2kzBEbWXRsXmEI_2MnA; psrf_qqaccess_token=E6BB617BE9AEE1862BBA2E952AC54EDD; uin=1934202608; qqmusic_key=Q_H_L_20i-C860eC7SNHfPD8sUUbmMd1Xyr5xy7gp0SLwl-mDa2kzBEbWXRsXmEI_2MnA; euin=oKEi7e-zowCzNn**; psrf_musickey_createtime=1645018816; psrf_qqunionid=47EB8F0A3255605D562909F1DF972826; psrf_access_token_expiresAt=1652794816; qm_keyst=Q_H_L_20i-C860eC7SNHfPD8sUUbmMd1Xyr5xy7gp0SLwl-mDa2kzBEbWXRsXmEI_2MnA; psrf_qqrefresh_token=DB546D237607FCF459159BF958D4897C; wxopenid=; wxunionid=; wxrefresh_token=; tmeLoginType=2; psrf_qqopenid=520C28B6F6A1E9DD5CB0C0B646444C2C; ts_last=y.qq.com/n/ryqq/player',

}

const cookieList = userInfo.cookie.split('; ').map(_ => _.trim());

const cookieObject = {};
cookieList.filter(Boolean).forEach(_ => {
  if (_) {
	const [key, value = ''] = _.split('=');

	cookieObject[key] = value;
  }
});

module.exports = Object.assign(userInfo, {
  uin: userInfo.loginUin || cookieObject.uin,
  cookieList,
  cookieObject,
});
