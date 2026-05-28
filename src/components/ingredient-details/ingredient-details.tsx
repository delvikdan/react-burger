import { useParams } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';

import styles from './ingredient-details.module.css';

const nutrientItems: {
  key: 'calories' | 'proteins' | 'fat' | 'carbohydrates';
  title: string;
}[] = [
  { key: 'calories', title: 'Калории, ккал' },
  { key: 'proteins', title: 'Белки, г' },
  { key: 'fat', title: 'Жиры, г' },
  { key: 'carbohydrates', title: 'Углеводы, г' },
];

export const IngredientDetails = (): React.JSX.Element | null => {
  const { id } = useParams();
  const ingredient = useAppSelector((state) =>
    state.ingredients.ingredients.find((item) => item._id === id)
  );

  if (!ingredient) {
    return null;
  }

  return (
    <article className={styles.ingredient_details}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <p className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
        {ingredient.name}
      </p>
      <ul className={styles.nutrients}>
        {nutrientItems.map(({ key, title }) => (
          <li key={key} className={styles.nutrient}>
            <span className="text text_type_main-default text_color_inactive">
              {title}
            </span>
            <span className="text text_type_digits-default text_color_inactive">
              {ingredient[key]}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};
