function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOT = '/';
const ROOT_ADMIN = '/admin';
const ROOT_CREATOR = '/creator';
const ROOT_CUSTOMER = '/customer';

export const PATH_AUTH = {
  signin: '/signin',
  signup: '/signup',
  signupInfo: '/signup/info',
};

export const PATH_SHOP = {
  root: "/",
  general: {
    discover: "/discover",
    package: "/package",
    artworkDetail: (artworkId: string) => `/discover/${artworkId}`
  },
  creator: {
    visitPage: (creatorId: string) => `/creator/${creatorId}`
  },
  profile: (userId: string) => `/profile/${userId}`
};

export const PATH_ADMIN = {
  root: ROOT_ADMIN,
  dashboard: path(ROOT_ADMIN, "/dashboard")
};

export const PATH_CREATOR = {
  root: ROOT_CREATOR,
  uploadArtwork: (creatorId: string) => `${ROOT_CREATOR}/${creatorId}/create`,
  editArtwork: (creatorId: string, artworkId: string) => `${ROOT_CREATOR}/${creatorId}/edit/${artworkId}`
};

export const PATH_CUSTOMER = {
  root: ROOT_CUSTOMER,
  wishlist: (customerId: string) => `${ROOT_CUSTOMER}/${customerId}/favorite`,
};

export const PATH_COMMON_USER = {
  order: "/user/order"
}