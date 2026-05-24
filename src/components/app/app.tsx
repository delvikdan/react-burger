import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { checkUserAuth } from '@services/slices/auth-slice';
import { fetchIngredients } from '@services/slices/ingredients-slice';
import { clearOrder } from '@services/slices/order-slice';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ingredientMatch = useMatch('/ingredients/:id');
  const { error, isLoading } = useAppSelector((state) => state.ingredients);
  const orderNumber = useAppSelector((state) => state.order.orderNumber);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <main className={`${styles.main} pl-5 pr-5`}>
          <Preloader />
        </main>
      ) : error ? (
        <main className={`${styles.main} pl-5 pr-5`}>
          <p className="text text_type_main-medium">Ошибка: {error}</p>
        </main>
      ) : (
        <Outlet />
      )}

      {ingredientMatch && (
        <Modal
          title="Детали ингредиента"
          onClose={() => {
            void navigate('/');
          }}
        >
          <IngredientDetails />
        </Modal>
      )}

      {orderNumber !== null && (
        <Modal
          title="Детали заказа"
          onClose={() => {
            dispatch(clearOrder());
          }}
        >
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
