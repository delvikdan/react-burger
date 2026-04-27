import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearCurrentIngredient } from '@services/slices/ingredient-details-slice';
import { createOrder } from '@services/slices/order-slice';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.burgerConstructor.ingredients);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const orderError = useAppSelector((state) => state.order.error);
  const [requestError, setRequestError] = useState<string | null>(null);

  const bun = useMemo(
    () => ingredients.find((ingredient) => ingredient.type === 'bun') ?? null,
    [ingredients]
  );

  const fillings = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type !== 'bun').slice(0, 6),
    [ingredients]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce(
      (sum: number, ingredient: TIngredient) => sum + ingredient.price,
      0
    );

    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  const ingredientIds = useMemo(() => {
    const fillingIds = fillings.map((ingredient) => ingredient._id);

    if (!bun) {
      return fillingIds;
    }

    return [bun._id, ...fillingIds, bun._id];
  }, [bun, fillings]);

  const handleOrderClick = async (): Promise<void> => {
    if (ingredientIds.length === 0) {
      setRequestError('Добавьте ингредиенты в конструктор');
      return;
    }

    setRequestError(null);
    dispatch(clearCurrentIngredient());

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
    } catch (_error) {
      setRequestError('Не удалось оформить заказ');
    }
  };

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
          extraClass={`${styles.bun_item} mb-4`}
        />
      )}

      <ul className={`${styles.ingredients_list} custom-scroll`}>
        {fillings.map((ingredient, index) => (
          <li key={`${ingredient._id}-${index}`} className={styles.ingredient_row}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>

      {bun && (
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
          extraClass={`${styles.bun_item} mt-4`}
        />
      )}

      <div className={styles.total_row}>
        <div className={styles.total_price}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          onClick={() => {
            void handleOrderClick();
          }}
          type="primary"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
      {(requestError ?? orderError) && (
        <p className="text text_type_main-default text_color_error mt-4">
          {requestError ?? orderError}
        </p>
      )}
    </section>
  );
};
