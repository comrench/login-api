import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const caloriesAdapter = createEntityAdapter({
  // sortComparer: (a, b) => (a.date === b.date ? 0 : a.name ? 1 : -1),
});

const initialState = caloriesAdapter.getInitialState();

export const caloriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalories: builder.query({
      query: () => '/calorie',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedCalories = responseData.map((calorie) => {
          calorie.id = calorie._id;
          return calorie;
        });
        return caloriesAdapter.setAll(initialState, loadedCalories);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            {
              type: 'Calorie',
              id: 'List',
            },
            ...result.ids.map((id) => ({ type: 'Calorie', id })),
          ];
        } else {
          return [{ type: 'Calorie', id: 'LIST' }];
        }
      },
    }),
    addNewCalorie: builder.mutation({
      query: (initialCalorieData) => ({
        url: '/calorie',
        method: 'POST',
        body: {
          ...initialCalorieData,
        },
      }),
      invalidatesTags: [{ type: 'Calorie', id: 'LIST' }],
    }),
    updateCalorie: builder.mutation({
      query: (initialCalorieData) => ({
        url: '/calorie',
        method: 'PATCH',
        body: {
          ...initialCalorieData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Calorie', id: arg.id },
      ],
    }),
    deleteCalorie: builder.mutation({
      query: ({ id }) => ({
        url: '/calorie',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Calorie', id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCaloriesQuery,
  useAddNewCalorieMutation,
  useUpdateCalorieMutation,
  useDeleteCalorieMutation,
} = caloriesApiSlice;

// returns the query result object
export const selectCaloriesResult =
  caloriesApiSlice.endpoints.getCalories.select();

// creates memoized selector
const selectCaloriesData = createSelector(
  selectCaloriesResult,
  (caloriesResult) => caloriesResult.data // normalized state object with ids and entities
);

// getSelectors create these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCalories,
  selectById: selectCalorieById,
  selectIds: selectCalorieIds,
  // Pass in a selector that returns the calories slice of state
} = caloriesAdapter.getSelectors(
  (state) => selectCaloriesData(state) ?? initialState
);
