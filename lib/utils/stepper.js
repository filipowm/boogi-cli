import ora from "ora";
import chalk from "chalk";

class Stepper {
  constructor(exitOnError = true) {
    this.spinner = ora({
      indent: 2,
    });
    this.current = null;
    this.exitOnError = exitOnError;
  }

  step(text, action) {
    try {
      this.spinner.start(text);
      const result = action();
      const txt = result.text ? result.text : null;
      if (
        result === false ||
        (result.status && result.status === StatusObj.ERROR)
      ) {
        this.spinner.fail(txt);
        if (this.exitOnError) {
            process.exit(1);
        }
      } else {
        if (result.status && result.status === StatusObj.WARN) {
          this.spinner.warn(txt);
        } else {
          this.spinner.succeed(txt);
        }
      }
      return true
    } catch (err) {
      this.spinner.fail();
      console.error(err)
      if (this.exitOnError) {
          process.exit(1);
      }
      return false;
    }
  }
}

// class Stepper {
//   constructor() {
//     this.spinner = ora({
//       indent: 2,
//     });
//     this.current = null;
//   }

//   async promised(action, text) {
//     return await this._createPromise(action, text);
//   }

//   _createPromise(action, text) {
//     return new Promise((resolve, reject) => {
//       try {
//         this.spinner.start(text);
//         const result = action();
//         if (
//           result === false ||
//           (result.status && result.status === StatusObj.ERROR)
//         ) {
//           reject(result);
//         } else {
//           resolve(result);
//         }
//       } catch (err) {
//         reject(err);
//       }
//     })
//       .then((result) => {
//         const txt = result.text ? result.text : null;
//         if (result.status && result.status === StatusObj.WARN) {
//           this.spinner.warn(txt);
//         } else {
//           this.spinner.succeed(txt);
//         }
//       })
//       .catch((err) => this.spinner.fail());
//   }

//   step(text, action) {
//     if (this.current != null) {
//       this.current.then(() => {
//         this.current = this._createPromise(action, text);
//         return this.current;
//       });
//     } else {
//       this.current = this._createPromise(action);
//     }

//     return this;
//   }
// }

export default Stepper;

const StatusObj = Object.freeze({
  SUCCESS: "x",
  WARN: "y",
  ERROR: "z",
});

export const Status = StatusObj;
