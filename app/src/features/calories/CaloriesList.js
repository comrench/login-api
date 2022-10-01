import { useGetCaloriesQuery } from './caloriesApiSlice';
import Calorie from './Calorie';

const CaloriesList = () => {
  const {
    data: calories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCaloriesQuery();

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = calories;
    console.log(ids);
    const tableContent = ids?.length
      ? ids.map((calorieId) => (
          <Calorie key={calorieId} calorieId={calorieId} />
        ))
      : null;

    content = (
      <table className='table table--calories'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th calorie__status'>
              Username
            </th>
            <th scope='col' className='table__th calorie__created'>
              Created
            </th>
            <th scope='col' className='table__th calorie__updated'>
              Updated
            </th>
            <th scope='col' className='table__th calorie__title'>
              Date
            </th>
            <th scope='col' className='table__th calorie__username'>
              Food
            </th>
            {/* <th scope='col' className='table__th calorie__username'>
              Quantity
            </th> */}
            <th scope='col' className='table__th calorie__edit'>
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
};

export default CaloriesList;
