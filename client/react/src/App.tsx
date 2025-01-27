import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PersistLogin, RequireAuth, ToastContainerWithProps } from "./components";
import {
  AdminArticles,
  AdminAuthors,
  AdminCategories,
  AdminDashboard,
  AdminUsers,
  AdminWrapper,
  Article,
  AuthWrapper,
  CategoryArticles,
  CreateArticle,
  ErrorForbidden,
  ErrorNoResourceFound,
  ErrorNoServerResponse,
  ErrorNoTFoundPage,
  ErrorServerError,
  ErrorUnauthorized,
  ExploreArticles,
  Home,
  LatestArticles,
  MainWrapper,
  PublicAuthorProfile,
  SearchArticles,
  TrendArticles,
  UpdateArticle,
  UserProfileOverview,
  UserProfileWrapper,
} from "./pages";
import { ROLES_LIST } from "./utils/rolesList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/*" element={<MainWrapper />}>
              {/* Auth Routes - Public Routes */}
              <Route path="auth" element={<AuthWrapper />}>
                <Route path="login" element={null} />
                <Route path="register" element={null} />
                <Route path="forget-password" element={null} />
                <Route path="oauth-success" element={null} />
              </Route>

              {/* Error Handler Routes - Public Routes */}
              <Route path="no-server-response" element={<ErrorNoServerResponse />} />
              <Route path="server-error" element={<ErrorServerError />} />
              <Route path="unauthorized" element={<ErrorUnauthorized />} />
              <Route path="forbidden" element={<ErrorForbidden />} />
              <Route path="no-resource-found" element={<ErrorNoResourceFound />} />
              <Route path="*" element={<ErrorNoTFoundPage />} />

              {/* Articles Routes */}
              <Route path="articles/:articleId" element={<Article />} />
              <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
                <Route path="articles/create" element={<CreateArticle />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Author]} />}>
                <Route path="articles/:articleId/update" element={<UpdateArticle />} />
              </Route>

              {/* Main Routes */}
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="explore" element={<ExploreArticles />} />
              <Route path="trend" element={<TrendArticles />} />
              <Route path="latest" element={<LatestArticles />} />
              <Route path="categories/:categoryId/articles" element={<CategoryArticles />} />
              <Route path="articles/search" element={<SearchArticles />} />

              {/* User Profile Routes */}
              <Route
                path="users/:userId"
                element={
                  <RequireAuth
                    allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Author, ROLES_LIST.User]}
                  />
                }
              >
                <Route path="*" element={<UserProfileWrapper />}>
                  <Route path="reading-list" element={null} />
                  <Route path="news-letters" element={null} />
                  <Route path="settings" element={null} />
                </Route>
              </Route>

              {/* User Profile Overview Route */}
              <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
                <Route path="users/:userId/overview" element={<UserProfileOverview />} />
              </Route>

              {/* Authors Routes */}
              <Route path="authors/:authorId" element={<PublicAuthorProfile />} />
            </Route>

            {/* Admin Dashboard - Protected Routes */}
            <Route path="/admin" element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
              <Route element={<AdminWrapper />}>
                <Route index element={<AdminDashboard />} />

                <Route path="dashboard" element={<AdminDashboard />} />

                <Route path="users" element={<AdminUsers />} />

                <Route path="authors" element={<AdminAuthors />} />

                <Route path="categories" element={<AdminCategories />} />

                <Route path="articles" element={<AdminArticles />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast Container with its props */}
      <ToastContainerWithProps />
    </>
  );
}

export default App;
