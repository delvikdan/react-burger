import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { BURGER_API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TIngredientsApiResponse = {
  success: boolean;
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchIngredients = async (): Promise<void> => {
      try {
        const response = await fetch(`${BURGER_API_URL}/ingredients`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Не удалось загрузить ингредиенты: ${response.status}`);
        }

        const result = (await response.json()) as TIngredientsApiResponse;

        if (!result.success) {
          throw new Error('Сервер вернул некорректный ответ');
        }

        setIngredients(result.data);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Произошла неизвестная ошибка'
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchIngredients();

    return (): void => {
      abortController.abort();
    };
  }, []);

  const handleCloseModal = (): void => {
    setSelectedIngredient(null);
    setIsOrderModalOpen(false);
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
          <BurgerIngredients
            ingredients={ingredients}
            onIngredientClick={(ingredient) => {
              setIsOrderModalOpen(false);
              setSelectedIngredient(ingredient);
            }}
          />
          <BurgerConstructor
            ingredients={ingredients}
            onOrderClick={() => {
              setSelectedIngredient(null);
              setIsOrderModalOpen(true);
            }}
          />
        </main>
      )}

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {isOrderModalOpen && (
        <Modal title="Детали заказа" onClose={handleCloseModal}>
          <OrderDetails orderNumber={34536} />
        </Modal>
      )}
    </div>
  );
};

export default App;
