/*import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from 'src/store';
import { UserCreateData } from 'src/components/acadx/interfaces';

@Module({ dynamic: true, store: store, name: 'createuser' })
class CreateUser extends VuexModule implements UserCreateData{

    type= ''
    national_id= ''
    email= ''
    first_name= ''
    last_name= ''
    password1= ''
    password2= ''

  /* this must be called after updating active loaders */
/* @Mutation
  public setType(typ:string) {
    this.type = type
  }
  @Mutation
  public setNationalId(typ: string) {
    this.type = type
  }

  @Mutation
  public removeNotification() {
    return this.notifications.pop();
  }
  @Mutation
  public lockNotify() {
    this.lock = true;
  }

  @Mutation
  public unlockNotify() {
    this.lock = false;
  }

  @Mutation
  public addActive(notif: [string, string]) {
    this.visible = notif;
  }

  @Mutation
  public removeActive() {
    this.visible = undefined;
  }

  @Action
  async show() {
    await new Promise(resolve => {
      setTimeout(() => {
        this.context.commit(
          'addActive',
          this.notifications[this.notifications.length - 1]
        );
        resolve(this.visible != undefined);
      }, 5000);
    });
    await new Promise(resolve => {
      setTimeout(() => {
        this.context.commit('removeActive');
        resolve(this.visible == undefined);
      }, 2000);
      return true;
    });
  }

  @Action
  public async notify(typeMsg: [string, string]) {
    this.context.commit('addNotification', typeMsg);

    if (!this.lock) {
      this.context.commit('lockNotify');
      while (this.notifications.length != 0) {
        await this.show();
        this.context.commit('removeNotification');
      }
      this.context.commit('unlockNotify');
    }
  }

  @Action
  public remove() {
    return this.context.commit('removeNotification');
  }
}
export default CreateUser;
*/
