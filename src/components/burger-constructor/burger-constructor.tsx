import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from '@services/slices/constructor-slice';
import { clearCurrentIngredient } from '@services/slices/ingredient-details-slice';
import { createOrder } from '@services/slices/order-slice';
import { DND_CONSTRUCTOR_INGREDIENT, DND_INGREDIENT } from '@utils/dnd';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TConstructorIngredient = TIngredient & { key: string };
type TConstructorDragItem = { index: number };

type TConstructorItemProps = {
  index: number;
  ingredient: TConstructorIngredient;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (key: string) => void;
};

const ConstructorItem = ({
  index,
  ingredient,
  onMove,
  onRemove,
}: TConstructorItemProps): React.JSX.Element => {
  const itemRef = useRef<HTMLLIElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_CONSTRUCTOR_INGREDIENT,
      item: { index },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: DND_CONSTRUCTOR_INGREDIENT,
      drop: (dragItem: TConstructorDragItem): void => {
        if (dragItem.index === index) {
          return;
        }

        onMove(dragItem.index, index);
        dragItem.index = index;
      },
    }),
    [index, onMove]
  );

  dragRef(dropRef(itemRef));

  return (
    <li
      data-testid="constructor-item"
      ref={itemRef}
      className={styles.ingredient_row}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        handleClose={() => {
          onRemove(ingredient.key);
        }}
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
      />
    </li>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const bun = useAppSelector((state) => state.burgerConstructor.bun);
  const fillings = useAppSelector((state) => state.burgerConstructor.ingredients);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const orderError = useAppSelector((state) => state.order.error);
  const user = useAppSelector((state) => state.auth.user);
  const [requestError, setRequestError] = useState<string | null>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DND_INGREDIENT,
    drop: (ingredient: TIngredient): void => {
      dispatch(addIngredient(ingredient));
    },
    collect: (monitor): { isOver: boolean } => ({
      isOver: monitor.isOver(),
    }),
  }));

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce(
      (sum: number, ingredient) => sum + ingredient.price,
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
    if (!user) {
      setRequestError(null);
      void navigate('/login', { state: { from: location } });
      return;
    }

    if (ingredientIds.length === 0 || !bun) {
      setRequestError('Добавьте булку и начинку в конструктор');
      return;
    }

    setRequestError(null);
    dispatch(clearCurrentIngredient());

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
      dispatch(clearConstructor());
    } catch (_error) {
      setRequestError('Не удалось оформить заказ');
    }
  };

  const handleMoveIngredient = (fromIndex: number, toIndex: number): void => {
    dispatch(moveIngredient({ fromIndex, toIndex }));
  };

  const handleRemoveIngredient = (key: string): void => {
    dispatch(removeIngredient(key));
  };

  return (
    <section
      data-testid="constructor-dropzone"
      ref={(node) => {
        dropRef(node);
      }}
      className={`${styles.burger_constructor} ${isOver ? styles.drop_active : ''}`}
    >
      {bun ? (
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
          extraClass={`${styles.bun_item} mb-4`}
        />
      ) : (
        <div className={`${styles.placeholder} ${styles.placeholder_top} mb-4`}>
          <p className="text text_type_main-default">Выберите булки</p>
        </div>
      )}

      <ul
        data-testid="constructor-ingredients"
        className={`${styles.ingredients_list} custom-scroll`}
      >
        {fillings.length > 0 ? (
          fillings.map((ingredient, index) => (
            <ConstructorItem
              key={ingredient.key}
              ingredient={ingredient}
              index={index}
              onMove={handleMoveIngredient}
              onRemove={handleRemoveIngredient}
            />
          ))
        ) : (
          <li className={styles.placeholder}>
            <p className="text text_type_main-default">Выберите начинку</p>
          </li>
        )}
      </ul>

      {bun ? (
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
          extraClass={`${styles.bun_item} mt-4`}
        />
      ) : (
        <div className={`${styles.placeholder} ${styles.placeholder_bottom} mt-4`}>
          <p className="text text_type_main-default">Выберите булки</p>
        </div>
      )}

      <div className={styles.total_row}>
        <div className={styles.total_price}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          data-testid="create-order-button"
          htmlType="button"
          onClick={() => {
            void handleOrderClick();
          }}
          type="primary"
          size="large"
          disabled={isLoading || !bun}
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
