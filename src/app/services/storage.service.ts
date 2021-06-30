import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class StorageService {
 
  constructor(private storage: Storage) { }
 
  
  async store(storageKey: string, value: any){
    return await this.storage.set(storageKey, value);
  }
 
  async get(storageKey: string){
    return new Promise(resolve => {
      this.storage.get(storageKey).then((value) => {
        if(value == null){
          resolve(false);
        }else{
          resolve(value);
        }
      });
    });
  }
 
  async removeItem(storageKey: string){
    await this.storage.remove(storageKey);
  }
 
  async clear(){
    await this.storage.clear();
  }
}