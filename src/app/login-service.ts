import {Injectable} from "@angular/core";

@Injectable()
export class LoginService {
  login(pin: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (pin === 112233) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }
}
