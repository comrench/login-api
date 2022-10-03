import { useSelector } from 'react-redux';
import { selectAllCalories } from '../calories/caloriesApiSlice';
import { selectAllUsers } from './usersApiSlice';

const UserReports = () => {
  const users = useSelector(selectAllUsers);
  const calories = useSelector(selectAllCalories);

  const today = new Date();

  const lastSeven = new Date();
  lastSeven.setDate(lastSeven.getDate() - 7);

  const lastFourteen = new Date();
  lastFourteen.setDate(lastFourteen.getDate() - 14);

  let lastWeek = 0;
  let weekBeforeLast = 0;

  calories.forEach((item) => {
    const date = new Date(item.date);
    if (date >= lastSeven) {
      lastWeek++;
    } else if (date > lastFourteen) {
      weekBeforeLast++;
    }
  });

  /** Find user averages */
  const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const groupByUser = groupBy(calories, 'username');

  const userAvgJson = {};

  for (let key in groupByUser) {
    if (groupByUser.hasOwnProperty(key)) {
      const reduced = groupByUser[key].reduce(function (m, d) {
        if (!m[d.date]) {
          m[d.date] = { ...d, count: 1 };
          return m;
        }
        m[d.date].quantity += d.quantity;
        m[d.date].count += 1;
        return m;
      }, {});

      let q = 0;
      let username = '';
      for (let k in reduced) {
        if (reduced.hasOwnProperty(k)) {
          if (new Date(reduced[k].date) >= lastSeven) {
            console.log(reduced[k].quantity);
            q += reduced[k].quantity;
          }
          if (!username) username = reduced[k].username;
        }
      }

      const average = q / 7;
      userAvgJson[username] = Math.round(average * 100) / 100;
    }
  }

  console.log(userAvgJson);

  return (
    <>
      <div>User reports</div>
      <div>Number of added entries in the last 7 days: {lastWeek}</div>
      <div>Number of added entries the week before that: {weekBeforeLast}</div>

      <br />
      <div>
        The average number of calories added per user for the last 7 days
      </div>
      <div>
        {Object.keys(userAvgJson).map((key, i) => (
          <p key={i}>
            <span>{key}</span>::<span>{userAvgJson[key]}</span>
          </p>
        ))}
      </div>
    </>
  );
};

export default UserReports;
