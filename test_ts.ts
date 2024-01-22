// Недобросовестный владелец авто пытается продать свою машину с пробегом как новую,
// воспользовавшись услугами хакера, который подкручивает ему пробег.
// Восстановите справедливость: сделайте так, чтобы машину нельзя было взломать.

// Абсолютно правильного ответа нет, цели можно добиться разными путями.
// Задача не сложная, но с огромным простором для креатива. Все зависит только от вас.
// Выкидывать персонажей нельзя, но можно добавлять своих.
// Исправьте ошибки, если они вам попадутся. И вообще, отшлифуйте код.
// Нам интересно любое решение. В идеале, вместе с решением мы ждем краткого объяснения,
// почему были сделаны те или иные изменения (в виде комментариев).
// Использование TypeScript будет дополнительным плюсом.
// Удачи!

// Решение задачи с использованием TypeScript 

interface HistoryRecord {
    time: number;
    currentDistance: number;
    overallDistance: number;
  }
  
// сделам класс car для использования модификаторов прав доступа и защитим историю и пробег от редактирования
class Car { 
  private name: string;
  private distancePassed: number = 0;
  private driveHistory: HistoryRecord [] = [];

  constructor(name: string) {
    this.name = name;
  }

  public getDistancePassed() : number {
    return this.distancePassed;
  }
  
  public getDriveHistory() : HistoryRecord [] {
    return this.driveHistory;
  }

  public beep(message?: string): void {
    console.log(this.name + ": " + "Beeeeep!" + (message ? " "  + message : ""));   
  }
  
  public drive(distance: number): void {
    this.beep();
    if (distance <= 0) {
      console.log("Incorrect value. Distance can't be equal zero or negative value");
      return;
    }
    this.distancePassed += distance;
    this.driveHistory.push({
      time: new Date().getTime(),
      currentDistance: distance,
      overallDistance: this.distancePassed,
    });
    console.log(
      "Done. Kilometers passed: " +
        distance +
        ". Overall: " +
        this.distancePassed
    );
  }
}

interface Hacker {
  hackCar(car: Car): Car;
  hackCar2(car: Car): Car;
}

const hacker: Hacker = {
  hackCar(car: Car): Car {
    const hackedHistory: (() => HistoryRecord)[] = [];
    let ctr = 0;
    const driveHistory = car.getDriveHistory();
    for (let i = 0; i < driveHistory.length; i++) {
      const historyRecord = driveHistory[i];
      hackedHistory.push(() => {
        let item: HistoryRecord = {
          time: historyRecord.time,
          currentDistance: 100,
          overallDistance: 100 * ++ctr,
        };
        return item;
      });
    }
    // хакер здесь не имеет возможности переписать историю поездок авто
    /*try {
      car.driveHistory = hackedHistory;      
    } catch (err) {
      console.log("Warning! Somebody is trying to hack car's history!! Car's drive history is protected and can't be change.");
    }*/
    return car;
  },
  hackCar2(car: Car): Car {
    let distance = Math.floor(car.getDistancePassed() / 2);
    car.drive(-distance);
    return car;
  }    
};

interface Customer {
  buyCar(car: Car): boolean;
}

const getCustomer = function (): Customer {
  const customer: Customer = {
    buyCar(car: Car): boolean {
      let summ = 0;
      const driveHistory = car.getDriveHistory();
      for (let i = 0; i < driveHistory.length; i++) {
        const historyRecord = driveHistory[i];
        summ += historyRecord.currentDistance;
      }
      if (summ > 100000) {
        console.log("I don't want to buy an old car");
        return false;
      } else {
        console.log("OK! I like your car. I buy it.");
        return true;
      }
    },
  };
  return customer;
};

interface Owner {
  car: Car;
  sellCar(): void;
  useCar(): void;
}

const owner: Owner = {
  car: new Car(""),
  sellCar(): void {
    const customer = getCustomer();
    if (customer.buyCar(this.car)) {
      console.log("Yay, I'm happy! I sold my old car!");
    } else {
      console.log("Aha. Let's hack this car and try to sell it again.");      
      let origDistance = this.car.getDistancePassed();
      this.car = hacker.hackCar(this.car);
      if (this.car.getDistancePassed() < origDistance) {
        this.sellCar(); 
      } else {       
        this.car = hacker.hackCar2(this.car); 
        if (this.car.getDistancePassed() < origDistance) {
          this.sellCar();
        } else {
          console.log("Hacker can't hack this car! (( ");    
        }  
      }
    }
  },
  useCar(): void {
    this.car.drive(18000);
    this.car.drive(22500);
    this.car.drive(98118);
    console.log("Enough. I want to sell this car.");
    this.sellCar(); 
  },
};

const superCar = new Car("Supercar");
owner.car = superCar;
owner.useCar();
