import { OrderInfo } from '@components/order-info/order-info';

type TOrderInfoPageProps = {
  source: 'feed' | 'profile';
};

export const OrderInfoPage = ({ source }: TOrderInfoPageProps): React.JSX.Element => (
  <OrderInfo source={source} />
);
