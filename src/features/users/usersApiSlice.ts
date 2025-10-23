import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import type { EntityState } from '@reduxjs/toolkit'
import type { TagDescription } from '@reduxjs/toolkit/query'
import { apiSlice } from '@/app/api/apiSlice'
import type { User } from '@/types/user'
import type { RootState } from '@/app/store'

// 🧠 Type nettoyé pour l’entity adapter
export type SanitizedUser = Omit<User, '_id'> & { id: string }

// 🧠 Adapter typé avec tri par username
const adapter = createEntityAdapter<SanitizedUser>({
  sortComparer: (a, b) => a.username.localeCompare(b.username),
})

// 🧠 État initial typé
const initialState: EntityState<SanitizedUser, string> = adapter.getInitialState()

// 🧠 Argument typé pour RTK Query
export type GetUsersQueryArg = { label: 'userList' }
export const defaultGetUsersArg: GetUsersQueryArg = { label: 'userList' }

// 🧠 Helper pour les tags
const userTag = (id: string): TagDescription<'User'> => ({ type: 'User', id })

// 🧠 Slice RTK Query injecté
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<SanitizedUser, string>, GetUsersQueryArg>({
      query: () => '/users',
      transformResponse: (raw: User[]) => {
        const sanitized = raw.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
        return adapter.setAll(initialState, sanitized)
      },
      providesTags: (result) =>
        result?.ids
          ? [userTag('LIST'), ...result.ids.map(userTag)]
          : [userTag('LIST')],
    }),

    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      async onQueryStarted(newUser, { dispatch, queryFulfilled, requestId }) {
        const tempId = `temp-${requestId}`
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData('getUsers', defaultGetUsersArg, (draft) => {
            adapter.addOne(draft, { ...newUser, id: tempId } as SanitizedUser)
          })
        )
        try {
          const { data: created } = await queryFulfilled
          dispatch(
            usersApiSlice.util.updateQueryData('getUsers', defaultGetUsersArg, (draft) => {
              adapter.updateOne(draft, {
                id: tempId,
                changes: { ...created, id: created._id },
              })
            })
          )
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: [userTag('LIST')],
    }),

    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData('getUsers', defaultGetUsersArg, (draft) => {
            adapter.updateOne(draft, { id, changes: patch })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_, __, { id }) => [userTag(id)],
    }),

    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData('getUsers', defaultGetUsersArg, (draft) => {
            adapter.removeOne(draft, id)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_, __, id) => [userTag(id)],
    }),
  }),
})

// ✅ Hooks auto-générés
export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice

// ✅ Sélecteur du résultat brut
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(defaultGetUsersArg)

// ✅ Sélecteur des données normalisées
const selectUsersData = createSelector(
  selectUsersResult,
  (result) => result.data ?? initialState
)

// ✅ Sélecteurs générés par l’adapter
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = adapter.getSelectors((state: RootState) => selectUsersData(state))




/*import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { TagDescription } from "@reduxjs/toolkit/query";
import { apiSlice } from "../../app/api/apiSlice";
import type { User } from "../../types/user";
import type { RootState } from "../../app/store";

// ✅ Type nettoyé pour le cache
export type SanitizedUser = Omit<User, "_id"> & { id: string };

// ✅ Adapter basé sur SanitizedUser
const usersAdapter = createEntityAdapter<SanitizedUser>({
  sortComparer: (a, b) => a.username.localeCompare(b.username)
});

// ✅ État initial typé
const initialState: EntityState<SanitizedUser, string> = usersAdapter.getInitialState();

// ✅ Argument typé pour DevTools
export type GetUsersQueryArg = { label: "userList" };
export const defaultGetUsersArg: GetUsersQueryArg = { label: "userList" };

// ✅ Helper pour les tags
const userTag = (id: string): TagDescription<"User"> => ({
  type: "User",
  id
});

// ✅ API Slice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<SanitizedUser, string>, GetUsersQueryArg>({
      query: () => "/users",
      transformResponse: (responseData: User[]) => {
        const sanitized = responseData.map((u) => ({
          ...u,
          id: u._id
        }));
        return usersAdapter.setAll(initialState, sanitized);
      },
      providesTags: (result) =>
        result?.ids
          ? [userTag("LIST"), ...result.ids.map(userTag)]
          : [userTag("LIST")]
    }),

    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body
      }),
      async onQueryStarted(newUser, { dispatch, queryFulfilled, requestId }) {
        const tempId = `temp-${requestId}`;
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUsers", defaultGetUsersArg, (draft) => {
            usersAdapter.addOne(draft, {
              ...newUser,
              id: tempId
            } as SanitizedUser);
          })
        );
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            usersApiSlice.util.updateQueryData("getUsers", defaultGetUsersArg, (draft) => {
              usersAdapter.updateOne(draft, {
                id: tempId,
                changes: { ...created, id: created._id }
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [userTag("LIST")]
    }),

    updateUser: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: patch
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUsers", defaultGetUsersArg, (draft) => {
            usersAdapter.updateOne(draft, { id, changes: patch });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, __, { id }) => [userTag(id)]
    }),

    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE"
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUsers", defaultGetUsersArg, (draft) => {
            usersAdapter.removeOne(draft, id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, __, id) => [userTag(id)]
    })
  })
});

// ✅ Hooks auto-générés
export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice;

// ✅ Sélecteur du résultat brut
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(defaultGetUsersArg);

// ✅ Sélecteur des données normalisées
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
);

// ✅ Sélecteurs générés par l'adapter
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors((state: RootState) => selectUsersData(state));*/
