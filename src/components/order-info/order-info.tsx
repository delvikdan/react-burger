import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderByNumberApi } from '@services/burger-api';
import { useAppSelector } from '@services/hooks';
import { ingredients as fallbackIngredients } from '@utils/ingredients';
import { getOrderStatusText } from '@utils/orders';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  source: 'feed' | 'profile';
};

type TIngredientWithCount = TIngredient & {
  count: number;
};

export const OrderInfo = ({ source }: TOrderInfoProps): React.JSX.Element => {
  const { id } = useParams();
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const ingredientMap = useMemo(
    () =>
      new Map(
        [...fallbackIngredients, ...ingredients].map((ingredient) => [
          ingredient._id,
          ingredient,
        ])
      ),
    [ingredients]
  );
  const sourceOrders = source === 'feed' ? feedOrders : profileOrders;
  const sourceOrder = sourceOrders.find((order) => order.number.toString() === id);
  const [order, setOrder] = useState<TOrder | null>(sourceOrder ?? null);
  const [isLoading, setIsLoading] = useState(sourceOrder === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      setOrder(null);
      setError('Заказ не найден');
      setIsLoading(false);

      return;
    }

    if (sourceOrder) {
      setOrder(sourceOrder);
      setError(null);
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    setError(null);

    void fetchOrderByNumberApi(id)
      .then((responseOrder) => {
        if (isCancelled) {
          return;
        }

        if (!responseOrder) {
          setError('Заказ не найден');
          setOrder(null);

          return;
        }

        setOrder(responseOrder);
      })
      .catch((requestError: unknown) => {
        if (isCancelled) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить заказ'
        );
        setOrder(null);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return (): void => {
      isCancelled = true;
    };
  }, [id, sourceOrder]);

  const ingredientsWithCount = useMemo<TIngredientWithCount[]>(() => {
    if (!order) {
      return [];
    }

    const counts = new Map<string, number>();

    order.ingredients.forEach((ingredientId) => {
      counts.set(ingredientId, (counts.get(ingredientId) ?? 0) + 1);
    });

    return Array.from(counts.entries()).flatMap(([ingredientId, count]) => {
      const ingredient = ingredientMap.get(ingredientId);

      return ingredient ? [{ ...ingredient, count }] : [];
    });
  }, [ingredientMap, order]);

  const totalPrice = ingredientsWithCount.reduce(
    (sum, ingredient) => sum + ingredient.price * ingredient.count,
    0
  );

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Preloader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.centered}>
        <p className="text text_type_main-medium">{error ?? 'Заказ не найден'}</p>
      </div>
    );
  }

  return (
    <article className={styles.orderInfo}>
      <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>
      <h2 className="text text_type_main-medium">{order.name}</h2>
      <p
        className={`${styles.status} text text_type_main-default ${
          order.status === 'done' ? styles.statusDone : ''
        }`}
      >
        {getOrderStatusText(order.status)}
      </p>
      <section className={styles.section}>
        <h3 className="text text_type_main-medium">Состав:</h3>
        <ul className={styles.ingredients}>
          {ingredientsWithCount.map((ingredient) => (
            <li key={ingredient._id} className={styles.ingredientRow}>
              <div className={styles.ingredientMeta}>
                <div className={styles.ingredientCircle}>
                  <img
                    alt={ingredient.name}
                    className={styles.ingredientImage}
                    src={ingredient.image}
                  />
                </div>
                <p className="text text_type_main-default">{ingredient.name}</p>
              </div>
              <div className={styles.ingredientPrice}>
                <span className="text text_type_digits-default">
                  {ingredient.count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <footer className={styles.footer}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.total}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </article>
  );
};
