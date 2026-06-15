import {
  Counter,
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { ingredients as fallbackIngredients } from '@utils/ingredients';
import { getOrderStatusText } from '@utils/orders';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  showStatus?: boolean;
  to: string;
};

const MAX_VISIBLE_INGREDIENTS = 6;

const getIngredientPrice = (ingredient: TIngredient | undefined): number =>
  ingredient?.price ?? 0;

export const OrderCard = ({
  order,
  showStatus = false,
  to,
}: TOrderCardProps): React.JSX.Element => {
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const ingredientMap = new Map(
    [...fallbackIngredients, ...ingredients].map((ingredient) => [
      ingredient._id,
      ingredient,
    ])
  );
  const visibleIngredientIds = order.ingredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenIngredientsCount = order.ingredients.length - MAX_VISIBLE_INGREDIENTS;
  const totalPrice = order.ingredients.reduce(
    (sum, ingredientId) => sum + getIngredientPrice(ingredientMap.get(ingredientId)),
    0
  );

  return (
    <Link className={styles.card} to={to}>
      <div className={styles.header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>
      <div className={styles.body}>
        <p className="text text_type_main-medium">{order.name}</p>
        {showStatus && (
          <p
            className={`${styles.status} text text_type_main-default ${
              order.status === 'done' ? styles.statusDone : ''
            }`}
          >
            {getOrderStatusText(order.status)}
          </p>
        )}
      </div>
      <div className={styles.footer}>
        <ul className={styles.ingredients}>
          {visibleIngredientIds.map((ingredientId, index) => {
            const ingredient = ingredientMap.get(ingredientId);
            const isLastVisible = index === MAX_VISIBLE_INGREDIENTS - 1;
            const hasOverlay = isLastVisible && hiddenIngredientsCount > 0;

            return (
              <li
                key={`${order._id}-${ingredientId}-${index}`}
                className={styles.ingredientItem}
                style={{ zIndex: MAX_VISIBLE_INGREDIENTS - index }}
              >
                <div className={styles.ingredientCircle}>
                  {ingredient && (
                    <img
                      alt={ingredient.name}
                      className={styles.ingredientImage}
                      src={ingredient.image}
                    />
                  )}
                  {hasOverlay && (
                    <div className={styles.overlay}>
                      <Counter count={hiddenIngredientsCount} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
