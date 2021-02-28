/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  AddressOptions,
  AddressDataOptions,
  SelectOptions,
  UpdateStateOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'address' })
export class Address extends VuexModule implements AddressOptions {
  [index: string]: ModuleIndexType;
  id = 0;
  address = '';
  suburb = '';
  country = 0;
  province = 0;
  city = 0;
  countries: SelectOptions[] = [];
  provinces: SelectOptions[] = [];
  cities: SelectOptions[] = [];
  changes: Record<string, string | boolean | number> = {};
  detailsChanged = false;

  get cityName() {
    const city = this.cities.find(city => city.value == this.city);
    return city?.label;
  }

  get provinceName() {
    const prov = this.provinces.find(prov => prov.value == this.province);
    return prov?.label;
  }
  get countryName() {
    const country = this.countries.find(
      country => country.value == this.country
    );
    return country?.label;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(address: AddressOptions) {
    const countries = [...this.countries];
    const cities = [...this.cities];
    const provinces = [...this.provinces];
    helpers.updateAcadxModule(this, address);
    this.countries = countries;
    this.cities = cities;
    this.provinces = provinces;
  }

  @Mutation
  updateData(data: AddressDataOptions) {
    helpers.updateSelectOptions(this.countries, data.countries);
    helpers.updateSelectOptions(this.provinces, data.provinces);
    helpers.updateSelectOptions(this.cities, data.cities);
  }

  @Action
  async commit() {
    const data = await helpers.commit(
      'address',
      `${helpers.getBaseUrl()}/schools/address/${this.id}`,
      this.changes
    );
    if (data) {
      //only school has key 'starting_number'
      if (data.hasOwnProperty('starting_number'))
        helpers.rootCommit('school/update', data);
      helpers.setState('address/detailsChanged', false);
      console.log(data);
      this.context.commit('update', data.address);
    }
  }
}
