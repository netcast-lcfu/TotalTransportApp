import {Component} from '@angular/core';
import {
  Platform,
  App,
  ModalController,
  AlertController,
  IonicPage,
  NavController,
  LoadingController,
  NavParams
} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {JPushService} from 'ionic2-jpush';
import {JpushUtilProvider} from "../../providers/jpush-util/jpush-util";
import {UserServiceProvider} from "../../providers/user-service/user-service";

/**
 * 首页
 */

@IonicPage({
  name: 'home',
  segment: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [JpushUtilProvider, StorageServiceProvider, UserServiceProvider]
})
export class HomePage {

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  constructor(public platform: Platform,
              public app: App,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public storageService: StorageServiceProvider,
              public jPushUtil: JpushUtilProvider,
              public userService: UserServiceProvider,
              public jPushPlugin: JPushService) {

    platform.ready().then(() => {
      //初始化极光推送
      this.initJPush();

      //注册极光推送通知栏打开事件
      this.jPushPlugin.openNotification().subscribe(res => {
        console.log('点击通知事件');
        this.jPushUtil.reduceBadge();
        console.log(res);
        // this.alertTips('点击通知消息内容：' + JSON.stringify(res));

        //根据不同平台取不同的数据
        if (this.platform.is("android")) {
          // let taskType = res.extras.taskType;
          // let contractId = res.extras.contractId;
        }

        if (this.platform.is("ios")) {
          // let taskType = res.taskType;
          // let contractId = res.contractId;
        }

      });

      this.jPushPlugin.receiveNotification().subscribe(res => {
        console.log('收到通知事件');
        console.log(res);
        // this.alertTips('收到通知消息内容：' + JSON.stringify(res));
      });

      this.jPushPlugin.receiveMessage().subscribe(res => {
        console.log('收到自定义消息事件');
        console.log(res);
        // this.alertTips('自定义消息内容：' + JSON.stringify(res));
      });

      this.jPushPlugin.backgroundNotification().subscribe(res => {
        console.log(res);
        console.log('收到后台消息');
        // this.alertTips('后台消息内容：' + JSON.stringify(res));
      });

    });


  }

  /**
   * 注册极光推送
   */
  initJPush() {
    this.jPushPlugin.init().then(res => {
      console.log(res);
      //this.alertTips('后台消息内容：' + JSON.stringify(res), '注册极光推送成功');
    }).catch(err => {
      console.log(err);
      //this.alertTips(err);
    });
  }

  /**
   * 极光推送获取ID
   */
  getRegistrationID() {
    this.jPushPlugin.getRegistrationID().then(res => {
      // alert(res);
      console.log(res);
      // let alert = this.alertCtrl.create({
      //   title: '获取极光推送ID',
      //   subTitle: '内容：' + JSON.stringify(res),
      //   buttons: ['确定']
      // });
      // alert.present();
      let jpushRegistrationId = res;
      if (Boolean(this.loginUser.id) && Boolean(jpushRegistrationId)) {
        // let alert = this.alertCtrl.create({
        //   title: '绑定极光推送ID调用',
        //   subTitle: '内容：teacherId:' + this.loginTeacher.teacherId + ',推送ID:' + jpushRegistrationId,
        //   buttons: ['确定']
        // });
        // alert.present();
        this.userService.updateJpushRegistrationId(this.loginUser.id, jpushRegistrationId).then(data => {
          console.log(data);
          // let alert = this.alertCtrl.create({
          //   title: '绑定极光推送ID返回',
          //   subTitle: '内容：' + JSON.stringify(data),
          //   buttons: ['确定']
          // });
          // alert.present();
        }, err => {
          console.log(err);
          // let alert = this.alertCtrl.create({
          //   title: '绑定极光推送ID错误返回',
          //   subTitle: '内容：' + JSON.stringify(err),
          //   buttons: ['确定']
          // });
          // alert.present();
        }).catch(err => {
          console.log(err);
          // let alert = this.alertCtrl.create({
          //   title: '绑定极光推送ID异常返回',
          //   subTitle: '内容：' + JSON.stringify(err),
          //   buttons: ['确定']
          // });
          // alert.present();
        });
      }
    }).catch(err => {
      // alert(err);
      console.log(err);
    });
  }

  /**
   * 极光推送设置标签
   */
  setTags(tags) {
    this.jPushPlugin.setTags({
      sequence: Date.now(),
      tags: tags
    }).then((res: any) => {
      console.log(res.tags.toString());
    }).catch(err => {
      console.log(err)
    });
  }

  ionViewDidEnter() {
    this.initLoginUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    this.getRegistrationID();
  }

  goToNotice() {
    this.navCtrl.push('notice');
  }

  // goToNoticeList() {
  //   this.navCtrl.push('notice-list');
  // }

  goToSearchShip() {
    this.navCtrl.push('search-ship');
  }

  goToSearchCargo() {
    this.navCtrl.push('search-cargo');
  }

  goToSearchTransportPrice() {
    this.navCtrl.push('search-transport-price')
  }

  goToLogisticsEnquiry() {
    this.navCtrl.push('logistics-enquiry');
  }

  goToSearchContractOrder() {
    this.navCtrl.push('search-contract-order');
  }

  goToSearchPortStock() {
    this.navCtrl.push('search-port-stock');
  }

  goToSearchLogisticsTask() {
    this.navCtrl.push('search-logistics-task');
  }

  goToBusinessCommission() {
    this.navCtrl.push('business-commission');
  }

  goToSearchBiddingReply() {
    this.navCtrl.push('search-bidding-reply');
  }

  goToSearchLogisticsTaskProvider() {
    this.navCtrl.push('search-logistics-task-provider');
  }

  /*验证提醒*/
  alertTips(tips, title?, timeout?) {
    let titleTip = '提示';
    if (title) {
      titleTip = title;
    }
    let alert = this.alertCtrl.create({
      title: titleTip,
      subTitle: tips,
      buttons: ['确定']
    });
    alert.present();
    if (timeout) {
      setTimeout(() => {
        alert.dismiss();
      }, timeout);
    }

  }

}
