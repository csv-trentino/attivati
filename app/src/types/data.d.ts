import { components, paths } from "@/types/api";

type SignInData = paths["/login"]["post"]["requestBody"]["content"]["application/json"];

type RequestCodeData =
  paths["/auth/request-code"]["post"]["requestBody"]["content"]["application/json"];

type VerifyCodeData =
  paths["/auth/verify-code"]["post"]["requestBody"]["content"]["application/json"];

type AccessToken = {
  accessToken: string;
  refreshToken: string;
};

type ProfileData = paths["/auth/user"]["patch"]["requestBody"]["content"]["application/json"];
type ActivityCreateData =
  paths["/activities"]["post"]["requestBody"]["content"]["application/json"];
type ActivityUpdateData =
  paths["/activities/{id}"]["put"]["requestBody"]["content"]["application/json"];

type User = components["schemas"]["User"];
type UserDevice = components["schemas"]["UserDevice"];

type Activity = components["schemas"]["Activity"];
type Experience = components["schemas"]["Experience"];
type Organization = components["schemas"]["Organization"];
type Place = components["schemas"]["Place"];
type Category = components["schemas"]["Category"];

type ActivityFilters = NonNullable<paths["/activities"]["get"]["parameters"]["query"]>;
type ExperienceFilters = NonNullable<paths["/experiences"]["get"]["parameters"]["query"]>;
type PlaceFilters = NonNullable<paths["/places"]["get"]["parameters"]["query"]>;

type RecentSearches = {
  experiences: string[];
  organizations: string[];
};
