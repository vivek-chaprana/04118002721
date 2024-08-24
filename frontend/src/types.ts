enum ECompanyType {
  AMZ = "AMZ",
  FLP = "FLP",
  SNP = "SNP",
  MYN = "MYN",
  AZO = "AZO",
}

enum ECategoryType {
  Phone = "Phone",
  Computer = "Computer",
  TV = "TV",
  Earphone = "Earphone",
  Tablet = "Tablet",
  Charger = "Charger",
  Mouse = "Mouse",
  Keypad = "Keypad",
  Bluetooth = "Bluetooth",
  Pendrive = "Pendrive",
  Remote = "Remote",
  Speaker = "Speaker",
  Headset = "Headset",
  Laptop = "Laptop",
  PC = "PC",
}

export type TCompanyType =
  | ECompanyType.AMZ
  | ECompanyType.FLP
  | ECompanyType.SNP
  | ECompanyType.MYN
  | ECompanyType.AZO;

export type TCategoryType =
  | ECategoryType.Phone
  | ECategoryType.Computer
  | ECategoryType.TV
  | ECategoryType.Earphone
  | ECategoryType.Tablet
  | ECategoryType.Charger
  | ECategoryType.Mouse
  | ECategoryType.Keypad
  | ECategoryType.Bluetooth
  | ECategoryType.Pendrive
  | ECategoryType.Remote
  | ECategoryType.Speaker
  | ECategoryType.Headset
  | ECategoryType.Laptop
  | ECategoryType.PC;
