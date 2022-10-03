import { useGetCaloriesQuery } from './caloriesApiSlice';
import Calorie from './Calorie';
import useAuth from '../../hooks/useAuth';

const CaloriesList = () => {
  const { username, isManager, isAdmin } = useAuth();

  const {
    data: calories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCaloriesQuery('caloriesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = calories;
    console.log(entities);
    let filteredIds;
    const dateQtyMap = new Map();
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (calorieId) => entities[calorieId].username === username
      );

      const entityArr = filteredIds.map((id) => entities[id]);

      let result = [];
      entityArr.reduce(function (res, value) {
        if (!res[value.date]) {
          res[value.date] = { date: value.date, quantity: 0 };
          result.push(res[value.date]);
        }
        res[value.date].quantity += value.quantity;
        return res;
      }, {});

      // console.log(result);

      result.forEach((item) => {
        dateQtyMap.set(item.date, item.quantity);
      });
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((calorieId) => (
        <Calorie
          key={calorieId}
          calorieId={calorieId}
          dateQtyMap={dateQtyMap}
        />
      ));

    content = (
      <table className='table table--calories'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th calorie__status'>
              Username
            </th>
            <th scope='col' className='table__th calorie__created'>
              Food
            </th>
            <th scope='col' className='table__th calorie__title '>
              Date / Time
            </th>
            <th scope='col' className='table__th calorie__updated'>
              Quantity
            </th>
            <th scope='col' className='table__th calorie__username'>
              Limit
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
