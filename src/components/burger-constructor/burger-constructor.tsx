import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
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
        <Button htmlType="button" onClick={onOrderClick} type="primary" size="large">
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
