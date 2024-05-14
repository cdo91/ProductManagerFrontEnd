export type RegistrationProps = {
    userName: string;
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    address: string;
    city: string;
    zipCode: number;
    email: string;
    phoneNumber: string;
    password: string;
    admin: boolean;
  }