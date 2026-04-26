import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TIngredientSection = 'bun' | 'main' | 'sauce';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

const ingredientSections: { key: TIngredientSection; title: string }[] = [
  { key: 'bun', title: 'Булки' },
  { key: 'main', title: 'Начинки' },
  { key: 'sauce', title: 'Соусы' },
];

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredientSection>('bun');

  const sectionRefs = useRef<Record<TIngredientSection, HTMLElement | null>>({
    bun: null,
    main: null,
    sauce: null,
  });

  const groupedIngredients = useMemo(
    () => ({
      bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
      main: ingredients.filter((ingredient) => ingredient.type === 'main'),
      sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    }),
    [ingredients]
  );

  const handleTabClick = (tab: string): void => {
    const nextTab = tab as TIngredientSection;
    setCurrentTab(nextTab);
    sectionRefs.current[nextTab]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.menu}>
        {ingredientSections.map(({ key, title }) => (
          <Tab
            key={key}
            value={key}
            active={currentTab === key}
            onClick={handleTabClick}
          >
            {title}
          </Tab>
        ))}
      </nav>

      <div className={`${styles.ingredients_scroll} custom-scroll`}>
        {ingredientSections.map(({ key, title }) => (
          <section
            key={key}
            ref={(element) => {
              sectionRefs.current[key] = element;
            }}
            className={styles.section}
          >
            <h2 className={`${styles.section_title} text text_type_main-medium`}>
              {title}
            </h2>
            <ul className={styles.cards}>
              {groupedIngredients[key].map((ingredient) => (
                <li key={ingredient._id} className={styles.card}>
                  <button
                    className={styles.card_button}
                    onClick={() => {
                      onIngredientClick(ingredient);
                    }}
                    type="button"
                  >
                    <Counter count={0} extraClass={styles.counter} />
                    <img
                      className={styles.image}
                      src={ingredient.image}
                      alt={ingredient.name}
                    />
                    <div className={`${styles.price} mt-1 mb-1`}>
                      <span className="text text_type_digits-default mr-2">
                        {ingredient.price}
                      </span>
                      <CurrencyIcon type="primary" />
                    </div>
                    <p className={`${styles.name} text text_type_main-default`}>
                      {ingredient.name}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
