import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import type { EntityState } from '@reduxjs/toolkit'
import type { TagDescription } from '@reduxjs/toolkit/query'
import { apiSlice } from '@/app/api/apiSlice'
import type { Course } from '@/types/course'
import type { RootState } from '@/app/store'

// 🧠 Type nettoyé pour l’entity adapter
export type SanitizedCourse = Omit<Course, '_id'> & { id: string }

// 🧠 Adapter typé avec tri par titre
const adapter = createEntityAdapter<SanitizedCourse>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

// 🧠 État initial typé
const initialState: EntityState<SanitizedCourse, string> = adapter.getInitialState()

// 🧠 Argument typé pour RTK Query
export type GetCoursesQueryArg = { label: 'courseList' }
export const defaultGetCoursesArg: GetCoursesQueryArg = { label: 'courseList' }

// 🧠 Helper pour les tags
const courseTag = (id: string): TagDescription<'Course'> => ({ type: 'Course', id })

// 🧠 Slice RTK Query injecté
export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<EntityState<SanitizedCourse, string>, GetCoursesQueryArg>({
      query: () => '/courses',
      transformResponse: (raw: Course[]) => {
        const sanitized = raw.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
        return adapter.setAll(initialState, sanitized)
      },
      providesTags: (result) =>
        result?.ids
          ? [courseTag('LIST'), ...result.ids.map(courseTag)]
          : [courseTag('LIST')],
    }),

    addCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
      }),
      async onQueryStarted(newCourse, { dispatch, queryFulfilled, requestId }) {
        const tempId = `temp-${requestId}`
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData('getCourses', defaultGetCoursesArg, (draft) => {
            adapter.addOne(draft, { ...newCourse, id: tempId } as SanitizedCourse)
          })
        )
        try {
          const { data: created } = await queryFulfilled
          dispatch(
            coursesApiSlice.util.updateQueryData('getCourses', defaultGetCoursesArg, (draft) => {
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
      invalidatesTags: [courseTag('LIST')],
    }),

    updateCourse: builder.mutation<Course, Partial<Course> & Pick<Course, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData('getCourses', defaultGetCoursesArg, (draft) => {
            adapter.updateOne(draft, { id, changes: patch })
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_, __, { id }) => [courseTag(id)],
    }),

    deleteCourse: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData('getCourses', defaultGetCoursesArg, (draft) => {
            adapter.removeOne(draft, id)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_, __, id) => [courseTag(id)],
    }),
  }),
})

// ✅ Hooks auto-générés
export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApiSlice

// ✅ Sélecteur du résultat brut
export const selectCoursesResult = coursesApiSlice.endpoints.getCourses.select(defaultGetCoursesArg)

// ✅ Sélecteur des données normalisées
const selectCoursesData = createSelector(
  selectCoursesResult,
  (result) => result.data ?? initialState
)

// ✅ Sélecteurs générés par l’adapter
export const {
  selectAll: selectAllCourses,
  selectById: selectCourseById,
  selectIds: selectCourseIds,
} = adapter.getSelectors((state: RootState) => selectCoursesData(state))


/*import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { TagDescription } from "@reduxjs/toolkit/query";
import { apiSlice } from "../../app/api/apiSlice";
import type { Course } from "../../types/course";
import type { RootState } from "../../app/store";


// ✅ Type nettoyé pour le cache
export type SanitizedCourse = Omit<Course, "_id"> & { id: string };

// ✅ Adapter typé
const coursesAdapter = createEntityAdapter<SanitizedCourse>({
  sortComparer: (a, b) => a.title.localeCompare(b.title)
});

// ✅ État initial
const initialState: EntityState<SanitizedCourse, string> = coursesAdapter.getInitialState();

// ✅ Argument typé pour DevTools
export type GetCoursesQueryArg = { label: "courseList" };
export const defaultGetCoursesArg: GetCoursesQueryArg = { label: "courseList" };

// ✅ Helper pour les tags
const courseTag = (id: string): TagDescription<"Course"> => ({
  type: "Course",
  id
});

// ✅ API Slice
export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<EntityState<SanitizedCourse, string>, GetCoursesQueryArg>({
      query: () => "/courses",
      transformResponse: (responseData: Course[]) => {
        const sanitized = responseData.map((u) => ({
          ...u,
          id: u._id
        }));
        return coursesAdapter.setAll(initialState, sanitized);
      },
      providesTags: (result): TagDescription<"Course">[] =>
        result?.ids
          ? [courseTag("LIST"), ...result.ids.map(courseTag)]
          : [courseTag("LIST")]
    }),

    addCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body
      }),
      async onQueryStarted(newCourse, { dispatch, queryFulfilled, requestId }) {
        const tempId = `temp-${requestId}`;
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData("getCourses", defaultGetCoursesArg, (draft) => {
            coursesAdapter.addOne(draft, {
              ...newCourse,
              id: tempId
            } as SanitizedCourse);
          })
        );
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            coursesApiSlice.util.updateQueryData("getCourses", defaultGetCoursesArg, (draft) => {
              coursesAdapter.updateOne(draft, {
                id: tempId,
                changes: { ...created, id: created._id }
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [courseTag("LIST")]
    }),

    updateCourse: builder.mutation<Course, Partial<Course> & Pick<Course, "id">>({
      query: ({ id, ...body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
        headers: { "Content-Type": "application/json" }
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData("getCourses", defaultGetCoursesArg, (draft) => {
            coursesAdapter.updateOne(draft, { id, changes: patch });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, __, { id }) => [courseTag(id)]
    }),

    deleteCourse: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE"
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          coursesApiSlice.util.updateQueryData("getCourses", defaultGetCoursesArg, (draft) => {
            coursesAdapter.removeOne(draft, id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, __, id) => [courseTag(id)]
    })
  })
});

// ✅ Hooks auto-générés
export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation
} = coursesApiSlice;

// ✅ Sélecteur du résultat brut
export const selectCoursesResult = coursesApiSlice.endpoints.getCourses.select(defaultGetCoursesArg);

// ✅ Sélecteur des données normalisées
const selectCoursesData = createSelector(
  selectCoursesResult,
  (coursesResult) => coursesResult.data ?? initialState
);

// ✅ Sélecteurs générés par l'adapter
export const {
  selectAll: selectAllCourses,
  selectById: selectCourseById,
  selectIds: selectCourseIds
} = coursesAdapter.getSelectors((state: RootState) => selectCoursesData(state));*/
