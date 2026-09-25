export type Service = {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
};

export type BookServiceHandler = (service: Service) => void;
