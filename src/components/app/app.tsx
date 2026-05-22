import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearCurrentIngredient } from '@services/slices/ingredient-details-slice';
import { fetchIngredients } from '@services/slices/ingredients-slice';
import { clearOrder } from '@services/slices/order-slice';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.ingredients);
  const selectedIngredient = useAppSelector(
    (state) => state.ingredientDetails.ingredient
  );
  const orderNumber = useAppSelector((state) => state.order.orderNumber);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseModal = (): void => {
    dispatch(clearCurrentIngredient());
    dispatch(clearOrder());
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading ? (
        <main className={`${styles.main} pl-5 pr-5`}>
          <Preloader />
        </main>
      ) : error ? (
        <main className={`${styles.main} pl-5 pr-5`}>
          <p className="text text_type_main-medium">Ошибка: {error}</p>
        </main>
      ) : (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </main>
      )}

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails />
        </Modal>
      )}

      {orderNumber !== null && (
        <Modal title="Детали заказа" onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
