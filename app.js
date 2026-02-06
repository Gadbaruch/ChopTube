const TILE_COUNT = 8;
const FREE_TILES = TILE_COUNT;
const NUDGE_LR = 0.1;
const NUDGE_UD = 10;
const NUDGE_LR_FINE = 0.01;
const NUDGE_UD_FINE = 1;
const BASE_DIVISION = 16;
const TILE_PLAY_KEYS = ["q", "w", "e", "r", "t", "y", "u", "i"];
const PLAY_RETRY_DELAY_MS = 250;
const PLAY_RETRY_COUNT = 8;
const RANDOM_VIDEO_IDS = Array.from(
  new Set([
  "dQw4w9WgXcQ",
  "kJQP7kiw5Fk",
  "9bZkp7q19f0",
  "fJ9rUzIMcZQ",
  "3JZ_D3ELwOQ",
  "hTWKbfoikeg",
  "YqeW9_5kURI",
  "L_jWHffIx5E",
  "CevxZvSJLk8",
  "RgKAFK5djSk",
  "2Vv-BfVoq4g",
  "OPf0YbXqDm0",
  "JGwWNGJdvx8",
  "YQHsXMglC9A",
  "CevxZvSJLk8",
  "YykjpeuMNEk",
  "iS1g8G_njx8",
  "hLQl3WQQoQ0",
  "uelHwf8o7_U",
  "KQ6zr6kCPj8",
  "ktvTqknDobU",
  "60ItHLz5WEA",
  "pRpeEdMmmQ0",
  "lp-EO5I60KA",
  "UceaB4D0jpo",
  "vNoKguSdy4Y",
  "nYh-n7EOtMA",
  "cH4E_t3m3xM",
  "2vjPBrBU-TM",
  "e-ORhEE9VVg",
  "hT_nvWreIhg",
  "tVj0ZTS4WF4",
  "09R8_2nJtjg",
  "YqeW9_5kURI",
  "L_jWHffIx5E",
  "hTWKbfoikeg",
  "ZZ5LpwO-An4",
  "DLzxrzFCyOs",
  "IcrbM1l_BoI",
  "8j9zMok6two",
  "QJO3ROT-A4E",
  "XOYs6QvA3hM",
  "u9Dg-g7t2l4",
  "fLexgOxsZu0",
  "YVkUvmDQ3HY",
  "9jK-NcRmVcw",
  "ktvTqknDobU",
  "vTIIMJ9tUc8",
  "34Na4j8AVgA",
  "QK8mJJJvaes",
  "6JCLY0Rlx6Q",
  "Pkh8UtuejGw",
  "fRh_vgS2dFE",
  "RubBzkZzpUA",
  "1lyu1KKwC74",
  "JwQZQygg3Lk",
  "d-diB65scQU",
  "XqZsoesa55w",
  "aqz-KE-bpKQ",
  "M7lc1UVf-VE",
  "ScMzIvxBSi4",
  "kXYiU_JCYtU",
  "M11SvDtPBhA",
  "LsoLEjrDogU",
  "hTWKbfoikeg",
  "y6120QOlsfU",
  "XGSy3_Czz8k",
  "4NRXx6U8ABQ",
  "J_ub7Etch2U",
  "k2qgadSvNyU",
  "wXhTHyIgQ_U",
  "XbGs_qK2PQA",
  "iik25wqIuFo",
  "VbfpW0pbvaU",
  "mWRsgZuwf_8",
  "tAGnKpE4NCI",
  "QJO3ROT-A4E",
  "bM7SZ5SBzyY",
  "5NV6Rdv1a3I",
  "4fndeDfaWCg",
  "nntGTK2Fhb0",
  "HgzGwKwLmgM",
  "Pkh8UtuejGw",
  "xTlNMmZKwpA",
  "8UVNT4wvIGY",
  "UqyT8IEBkvY",
  "3JWTaaS7LdU",
  "eY52Zsg-KVI",
  "4Tr0otuiQuU",
  "gCYcHz2k5x0",
  "LsoLEjrDogU",
  "QH2-TGUlwu4",
  "8ybW48rKBME",
  "yPYZpwSpKmA",
  "As03tlODkdw",
  "sOnqjkJTMaA",
  "2vjPBrBU-TM",
  "nfWlot6h_JM",
  "4aQDOUbErNg",
  "TUVcZfQe-Kw",
  "D8K90hX4PrE",
  "IdneKLhsWOQ",
  "LHCob76kigA",
  "7wtfhZwyrcc",
  "kffacxfA7G4",
  "sNPnbI1arSE",
  "uelHwf8o7_U",
  "5qm8PH4xAss",
  "Y66j_BUCBMY",
  "2zNSgSzhBfM",
  "F57P9C4SAW4",
  "2zToEPpFEN8",
  "eVTXPUF4Oz4",
  "bMt47wvK6u0",
  "jofNR_WkoCE",
  "Q0oIoR9mLwc",
  "fWNaR-rxAic",
])
);
const RANDOM_VIDEO_POOLS = {
  top_hits: [
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    "https://www.youtube.com/watch?v=fRh_vgS2dFE",
    "https://www.youtube.com/watch?v=YQHsXMglC9A",
    "https://www.youtube.com/watch?v=CevxZvSJLk8",
    "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
    "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
    "https://www.youtube.com/watch?v=uelHwf8o7_U",
  ],
  vintage_music: [
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=L_jWHffIx5E",
    "https://www.youtube.com/watch?v=hTWKbfoikeg",
    "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    "https://www.youtube.com/watch?v=tAGnKpE4NCI",
    "https://www.youtube.com/watch?v=HgzGwKwLmgM",
  ],
  classic_meme: [
    "https://www.youtube.com/watch?v=4v8ek9TEeOU",
    "https://www.youtube.com/watch?v=zLTZPK8HhFI",
    "https://www.youtube.com/watch?v=bE4C8a48o1E",
    "https://www.youtube.com/watch?v=wF1l_KtIUoA",
    "https://www.youtube.com/watch?v=JNsKvZo6MDs",
    "https://www.youtube.com/watch?v=Obgnr9pc820",
    "https://www.youtube.com/watch?v=YCeQLeQiRP4",
    "https://www.youtube.com/watch?v=5LfeJdpk3K4",
    "https://www.youtube.com/watch?v=q6EoRBvdVPQ",
    "https://www.youtube.com/watch?v=ajlkhFnz8eo",
    "https://www.youtube.com/watch?v=WxrQ3SqSt6Q",
    "https://www.youtube.com/watch?v=yBLdQ1a4-JI",
  ],
  solo_drummers: [
    "https://www.youtube.com/watch?v=9esWG6A6g-k",
    "https://www.youtube.com/watch?v=IXK0m1Uq2Io",
    "https://www.youtube.com/watch?v=4jh4vr6ZxXE",
    "https://www.youtube.com/watch?v=66TQ4TqiAFs",
    "https://www.youtube.com/watch?v=7sJ6pFK5DOI",
    "https://www.youtube.com/watch?v=zW8-mBGpYEc",
    "https://www.youtube.com/watch?v=NdQ2dIQxcGQ",
    "https://www.youtube.com/watch?v=17XlFsBT07o",
    "https://www.youtube.com/watch?v=M9Pb6PF8LXA",
    "https://www.youtube.com/watch?v=c6q2dRTwp_Q",
    "https://www.youtube.com/watch?v=jmHPlZHkg6A",
    "https://www.youtube.com/watch?v=XrnqKriMNtQ",
    "https://www.youtube.com/watch?v=rH-WBDcttRU",
    "https://www.youtube.com/watch?v=jHC5Vh07T4k",
    "https://www.youtube.com/watch?v=h22r2-1BKXk",
    "https://www.youtube.com/watch?v=ol565BzRUyg",
    "https://www.youtube.com/watch?v=alF-VK18syo",
    "https://www.youtube.com/watch?v=fyoxJtQ8vYU",
    "https://www.youtube.com/watch?v=aAOL_KSr2WM",
    "https://www.youtube.com/watch?v=f8dD5-mFUgs",
  ],
  classic_breaks: [
    "https://www.youtube.com/watch?v=XRTcQk4A4AE",
    "https://www.youtube.com/watch?v=DD6IfqoEHmM",
    "https://www.youtube.com/watch?v=YzaEs2q1gb8",
    "https://www.youtube.com/watch?v=asMG7xKcRpg",
    "https://www.youtube.com/watch?v=BbklLMZuOLU",
    "https://www.youtube.com/watch?v=DlBIfPvKRiY",
    "https://www.youtube.com/watch?v=rJsrKRfqCBk",
    "https://www.youtube.com/watch?v=P_P-7Tm588g",
    "https://www.youtube.com/watch?v=f76DuKeat0Y",
    "https://www.youtube.com/watch?v=oeoQw6aoNEs",
  ],
  world_music: [
    "https://www.youtube.com/watch?v=lSWCAmlkoNA",
    "https://www.youtube.com/watch?v=XISyGA6x5uk",
    "https://www.youtube.com/watch?v=4FAEp9ExSno",
    "https://www.youtube.com/watch?v=hognzVJdHLE",
    "https://www.youtube.com/watch?v=IKBVWn3MVr8",
    "https://www.youtube.com/watch?v=9tzGmDdq6DE",
    "https://www.youtube.com/watch?v=xB_EEFcM6TE",
    "https://www.youtube.com/watch?v=RfnaQ9Cuw5k",
    "https://www.youtube.com/watch?v=voqgr3JFYD4",
    "https://www.youtube.com/watch?v=QdrPmZwsXiM",
    "https://www.youtube.com/watch?v=WnjcHNnPLeo",
    "https://www.youtube.com/watch?v=ZHoRxHRpQbw",
    "https://www.youtube.com/watch?v=lVPLIuBy9CY",
    "https://www.youtube.com/watch?v=RFjRJmGYrCg",
    "https://www.youtube.com/watch?v=IrMTuvsTQeQ",
    "https://www.youtube.com/watch?v=yh5JTq0iyCc",
    "https://www.youtube.com/watch?v=RL0rZXzu8Qc",
    "https://www.youtube.com/watch?v=nms23cFcCZE",
    "https://www.youtube.com/watch?v=B9FzVhw8_bY",
    "https://www.youtube.com/watch?v=qP-7GNoDJ5c",
    "https://www.youtube.com/watch?v=v4xZUr0BEfE",
    "https://www.youtube.com/watch?v=zOvsyamoEDg",
    "https://www.youtube.com/watch?v=zPonioDYnoY",
    "https://www.youtube.com/watch?v=wlaZSx6tqRo",
    "https://www.youtube.com/watch?v=Ib1WC43g0Zs",
    "https://www.youtube.com/watch?v=igmpvrRQIkI",
    "https://www.youtube.com/watch?v=2CPV0_t1sbY",
    "https://www.youtube.com/watch?v=TIwv3eh4Mq4",
    "https://www.youtube.com/watch?v=tU3oAyin8W4",
    "https://www.youtube.com/watch?v=sycoh3fVJ4M",
    "https://www.youtube.com/watch?v=1jym1kIgqGQ",
    "https://www.youtube.com/watch?v=drSEfVfnvxY",
    "https://www.youtube.com/watch?v=12RPjPSklxA",
    "https://www.youtube.com/watch?v=ug2TrGD7INY",
  ],
  accapellas: [
    "https://www.youtube.com/watch?v=nMCD9_ALvNY",
    "https://www.youtube.com/watch?v=T-6iL3c2Lb8",
    "https://www.youtube.com/watch?v=RmBt3s96ymk",
    "https://www.youtube.com/watch?v=_Gxr2o3-vyE",
    "https://www.youtube.com/watch?v=_hOsvvFc_8U",
    "https://www.youtube.com/watch?v=YO9KEKnnlKs",
    "https://www.youtube.com/watch?v=UoAJS9BnB4s",
    "https://www.youtube.com/watch?v=sEU67M033H0",
    "https://www.youtube.com/watch?v=EeXKcxsS3j0",
    "https://www.youtube.com/watch?v=34juJeZCnKc",
    "https://www.youtube.com/watch?v=MozRs9RvYhk",
    "https://www.youtube.com/watch?v=aKQOjCFKX-g",
  ],
  loop_samples: [
    "https://www.youtube.com/watch?v=Mbq6Xuc7U8Q",
    "https://www.youtube.com/watch?v=VVBeDsuR0CM",
    "https://www.youtube.com/watch?v=fJykAKESZ_Q",
    "https://www.youtube.com/watch?v=nFT8_hSpsQE",
    "https://www.youtube.com/watch?v=2uLzDP7K7IQ",
    "https://www.youtube.com/watch?v=irMlFscYyZg",
    "https://www.youtube.com/watch?v=ATiDp9b8Mvs",
    "https://www.youtube.com/watch?v=BKppsibFNig",
    "https://www.youtube.com/watch?v=uD93twGoAro",
    "https://www.youtube.com/watch?v=QmVNCJhtHD4",
    "https://www.youtube.com/watch?v=Hv0S8bojjiw",
    "https://www.youtube.com/watch?v=0R6ImFXEs9E",
  ],
  drum_loops: [
    "https://www.youtube.com/watch?v=TP32vjzsyPI",
    "https://www.youtube.com/watch?v=_2IMFf58z5k",
    "https://www.youtube.com/watch?v=gjs6zrhY-Ak",
    "https://www.youtube.com/watch?v=L1kk8xGK6cs",
    "https://www.youtube.com/watch?v=uD2a7IzXFKs",
    "https://www.youtube.com/watch?v=nsh_t7c12_4",
    "https://www.youtube.com/watch?v=Xf9fkxT60OE",
    "https://www.youtube.com/watch?v=Bz4mK8bmDus",
    "https://www.youtube.com/watch?v=446UcmML0Qw",
    "https://www.youtube.com/watch?v=3Uxb3_fJLx4",
    "https://www.youtube.com/watch?v=wxnnFZ15Mqw",
    "https://www.youtube.com/watch?v=YQXZeJhMRPE",
  ],
  weird_videos: [
    "https://www.youtube.com/watch?v=i29t-5tEp_o",
    "https://www.youtube.com/watch?v=uqcyDA2L5L0",
    "https://www.youtube.com/watch?v=87NHueHBHwY",
    "https://www.youtube.com/watch?v=cUpJZAk9YAk",
    "https://www.youtube.com/watch?v=XpdUkZbUbbo",
    "https://www.youtube.com/watch?v=BvBhWMZQg6g",
    "https://www.youtube.com/watch?v=018f1iLqRbQ",
    "https://www.youtube.com/watch?v=g0ZW534Ho-8",
    "https://www.youtube.com/watch?v=jdRCNM2k42o",
    "https://www.youtube.com/watch?v=LB871SVYMhI",
    "https://www.youtube.com/watch?v=9EiinQ1QNXU",
    "https://www.youtube.com/watch?v=erh2ngRZxs0",
  ],
  experimental_sounds: [
    "https://www.youtube.com/watch?v=_wJPXrO1cdg",
    "https://www.youtube.com/watch?v=lYeP8a_Y_0A",
    "https://www.youtube.com/watch?v=Pb42GbADwZM",
    "https://www.youtube.com/watch?v=c9NCs9EmNRg",
    "https://www.youtube.com/watch?v=6hIgBEXuQD8",
    "https://www.youtube.com/watch?v=VhWAAazQuDY",
    "https://www.youtube.com/watch?v=tblmXoz4Foc",
    "https://www.youtube.com/watch?v=FDYSSBcsFHI",
    "https://www.youtube.com/watch?v=P_fIGvP_9MM",
    "https://www.youtube.com/watch?v=bu3g_olZUcU",
    "https://www.youtube.com/watch?v=3rdTt3u9h30",
    "https://www.youtube.com/watch?v=pc1ttO9myWw",
    "https://www.youtube.com/watch?v=N6roTJFAfEU",
    "https://www.youtube.com/watch?v=QQL0IkML1Gk",
    "https://www.youtube.com/watch?v=6llnk9DhiFE",
    "https://www.youtube.com/watch?v=G3H1FCSi_-M",
  ],
  jazzy_girls: [
    "https://www.youtube.com/watch?v=TEOzIc9LHGg",
    "https://www.youtube.com/watch?v=hs58v0rKQgY",
    "https://www.youtube.com/watch?v=keqMSbW1EUk",
    "https://www.youtube.com/watch?v=KkNnHWWARYY",
    "https://www.youtube.com/watch?v=CcAn_FYl_y0",
    "https://www.youtube.com/watch?v=pV61GrA8PME",
    "https://www.youtube.com/watch?v=Vi2WQkiAw-U",
    "https://www.youtube.com/watch?v=lJXLqAutql4",
    "https://www.youtube.com/watch?v=dusavln6Cjw",
    "https://www.youtube.com/watch?v=uHdvWel-fRg",
    "https://www.youtube.com/watch?v=x8cFdZyWOOs",
    "https://www.youtube.com/watch?v=KKIammrhEp4",
  ],
  zero_views_videos: [
    "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    "https://www.youtube.com/watch?v=RubBzkZzpUA",
    "https://www.youtube.com/watch?v=J_ub7Etch2U",
    "https://www.youtube.com/watch?v=7wtfhZwyrcc",
  ],
};
const VIDEO_POOL_OPTIONS = [
  { key: "top_hits", label: "Top 100 hits" },
  { key: "vintage_music", label: "Vintage music" },
  { key: "classic_meme", label: "Classic Meme" },
  { key: "solo_drummers", label: "Solo drummers" },
  { key: "classic_breaks", label: "Classic breaks" },
  { key: "world_music", label: "World music" },
  { key: "accapellas", label: "Accapellas" },
  { key: "loop_samples", label: "Loop packs" },
  { key: "drum_loops", label: "Drum loops" },
  { key: "weird_videos", label: "Weird videos" },
  { key: "experimental_sounds", label: "Experimental sounds" },
  { key: "jazzy_girls", label: "Jazzy girls" },
  { key: "zero_views_videos", label: "0 views videos" },
];
const COMMUNITY_DISCORD_URL = "https://discord.gg/j6D9WKZN";
const COMMUNITY_SESSIONS = [
  {
    name: "Peppa Beat",
    url: "https://gadbaruch.github.io/ChopTube/#JTdCJTIyYnBtJTIyJTNBMTE3JTJDJTIyc2VsZWN0ZWRJbmRleCUyMiUzQTAlMkMlMjJzZWxlY3RlZEN1ZSUyMiUzQTUlMkMlMjJ0aWxlcyUyMiUzQSU1QiU3QiUyMnZpZGVvVXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZ3YXRjaCUzRnYlM0RLVmVFN3NFVGx2QSUyMiUyQyUyMmN1ZXMlMjIlM0ElNUIwJTJDOC41NCUyQzE1Ljc3Nzc3Nzc3Nzc3Nzc3OSUyQzIzLjY2NjY2NjY2NjY2NjY2OCUyQzMxLjU1NTU1NTU1NTU1NTU1NyUyQzMwLjY0JTJDNDcuMzMzMzMzMzMzMzMzMzM2JTJDNTUuMjIyMjIyMjIyMjIyMjMlMkM2My4xMTExMTExMTExMTExMTQlMkM3MSU1RCUyQyUyMmFjdGlvbnMlMjIlM0ElNUIlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBMSU3RCU1RCUyQ251bGwlMkNudWxsJTJDbnVsbCUyQyU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0E1JTdEJTVEJTJDbnVsbCUyQ251bGwlMkNudWxsJTJDJTVCJTdCJTIydHlwZSUyMiUzQSUyMnNlZWslMjIlMkMlMjJjdWVJbmRleCUyMiUzQTElN0QlNUQlMkNudWxsJTJDbnVsbCUyQ251bGwlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBNSU3RCU1RCU1RCUyQyUyMnN0ZXBzJTIyJTNBMTYlMkMlMjJkaXZpc2lvbiUyMiUzQTE2JTJDJTIyY3VzdG9tQ3VlcyUyMiUzQXRydWUlN0QlMkMlN0IlMjJ2aWRlb1VybCUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGd3d3LnlvdXR1YmUuY29tJTJGd2F0Y2glM0Z2JTNESnAyQ2VkVTNCa0klMjIlMkMlMjJjdWVzJTIyJTNBJTVCMCUyQzMwMCUyQzYwMCUyQzkwMCUyQzEyMDAlMkMxNTAwJTJDMTgwMCUyQzIxMDEuNSUyQzI0MDAlMkMyNzAwJTVEJTJDJTIyYWN0aW9ucyUyMiUzQSU1QiU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0ExJTdEJTVEJTJDbnVsbCUyQ251bGwlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBNyU3RCU1RCUyQ251bGwlMkNudWxsJTJDbnVsbCUyQyU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0E0JTdEJTVEJTJDbnVsbCUyQ251bGwlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBMyU3RCU1RCU1RCUyQyUyMnN0ZXBzJTIyJTNBMTYlMkMlMjJkaXZpc2lvbiUyMiUzQTE2JTJDJTIyY3VzdG9tQ3VlcyUyMiUzQWZhbHNlJTdEJTJDJTdCJTIydmlkZW9VcmwlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy55b3V0dWJlLmNvbSUyRndhdGNoJTNGdiUzRC1EcmE1UjYtMUxFJTIyJTJDJTIyY3VlcyUyMiUzQSU1QjAlMkMxNDYuODg4ODg4ODg4ODg4ODklMkMyOTMuNzc3Nzc3Nzc3Nzc3NzclMkM0NDAuNjY2NjY2NjY2NjY2NjMlMkM1ODcuNTU1NTU1NTU1NTU1NSUyQzczNi42OTQ0NDQ0NDQ0NDQ1JTJDODgxLjMzMzMzMzMzMzMzMzMlMkMxMDI4LjIyMjIyMjIyMjIyMjIlMkMxMTc1LjExMTExMTExMTExMSUyQzEzMjIlNUQlMkMlMjJhY3Rpb25zJTIyJTNBJTVCJTVCJTdCJTIydHlwZSUyMiUzQSUyMnNlZWslMjIlMkMlMjJjdWVJbmRleCUyMiUzQTElN0QlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBMSU3RCU1RCUyQyU1QiU1RCUyQyU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0EyJTdEJTVEJTJDJTVCJTVEJTJDJTVCJTVEJTJDJTVCJTVEJTJDJTVCJTVEJTJDJTVCJTVEJTJDJTVCJTVEJTJDJTVCJTdCJTIydHlwZSUyMiUzQSUyMnNlZWslMjIlMkMlMjJjdWVJbmRleCUyMiUzQTYlN0QlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBNSU3RCU1RCUyQyU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0E1JTdEJTVEJTJDJTVCJTdCJTIydHlwZSUyMiUzQSUyMnNlZWslMjIlMkMlMjJjdWVJbmRleCUyMiUzQTUlN0QlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlMkMlNUIlNUQlNUQlMkMlMjJzdGVwcyUyMiUzQTMyJTJDJTIyZGl2aXNpb24lMjIlM0ExNiUyQyUyMmN1c3RvbUN1ZXMlMjIlM0FmYWxzZSU3RCUyQyU3QiUyMnZpZGVvVXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZ3YXRjaCUzRnYlM0RfR1psSkdFUmJ2RSUyNmxpc3QlM0RSRF9HWmxKR0VSYnZFJTI2c3RhcnRfcmFkaW8lM0QxJTIyJTJDJTIyY3VlcyUyMiUzQSU1QjAlMkMyNC41NTU1NTU1NTU1NTU1NTclMkM0OS4xMTExMTExMTExMTExMTQlMkM3My42NjY2NjY2NjY2NjY2NyUyQzk0Ljk3MjIyMjIyMjIyMjIzJTJDMTIyLjc3Nzc3Nzc3Nzc3Nzc5JTJDMTQ3LjMzMzMzMzMzMzMzMzM0JTJDMTcxLjg4ODg4ODg4ODg4ODklMkMxOTYuNDQ0NDQ0NDQ0NDQ0NDYlMkMyMjElNUQlMkMlMjJhY3Rpb25zJTIyJTNBJTVCJTVCJTdCJTIydHlwZSUyMiUzQSUyMnNlZWslMjIlMkMlMjJjdWVJbmRleCUyMiUzQTElN0QlNUQlMkMlNUIlNUQlMkNudWxsJTJDbnVsbCUyQyU1QiU1RCUyQyU1QiU1RCUyQ251bGwlMkMlNUIlN0IlMjJ0eXBlJTIyJTNBJTIyc2VlayUyMiUyQyUyMmN1ZUluZGV4JTIyJTNBMyU3RCU1RCUyQ251bGwlMkNudWxsJTJDbnVsbCUyQ251bGwlMkNudWxsJTJDbnVsbCUyQyU1QiU3QiUyMnR5cGUlMjIlM0ElMjJzZWVrJTIyJTJDJTIyY3VlSW5kZXglMjIlM0E0JTdEJTVEJTJDJTVCJTVEJTVEJTJDJTIyc3RlcHMlMjIlM0ExNiUyQyUyMmRpdmlzaW9uJTIyJTNBMTYlMkMlMjJjdXN0b21DdWVzJTIyJTNBZmFsc2UlN0QlMkMlN0IlMjJ2aWRlb1VybCUyMiUzQSUyMiUyMiUyQyUyMmN1ZXMlMjIlM0ElNUIwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTVEJTJDJTIyYWN0aW9ucyUyMiUzQSU1QiU1RCUyQyUyMnN0ZXBzJTIyJTNBMTYlMkMlMjJkaXZpc2lvbiUyMiUzQTE2JTJDJTIyY3VzdG9tQ3VlcyUyMiUzQWZhbHNlJTdEJTJDJTdCJTIydmlkZW9VcmwlMjIlM0ElMjIlMjIlMkMlMjJjdWVzJTIyJTNBJTVCMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCU1RCUyQyUyMmFjdGlvbnMlMjIlM0ElNUIlNUQlMkMlMjJzdGVwcyUyMiUzQTE2JTJDJTIyZGl2aXNpb24lMjIlM0ExNiUyQyUyMmN1c3RvbUN1ZXMlMjIlM0FmYWxzZSU3RCUyQyU3QiUyMnZpZGVvVXJsJTIyJTNBJTIyJTIyJTJDJTIyY3VlcyUyMiUzQSU1QjAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlNUQlMkMlMjJhY3Rpb25zJTIyJTNBJTVCJTVEJTJDJTIyc3RlcHMlMjIlM0ExNiUyQyUyMmRpdmlzaW9uJTIyJTNBMTYlMkMlMjJjdXN0b21DdWVzJTIyJTNBZmFsc2UlN0QlMkMlN0IlMjJ2aWRlb1VybCUyMiUzQSUyMiUyMiUyQyUyMmN1ZXMlMjIlM0ElNUIwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTVEJTJDJTIyYWN0aW9ucyUyMiUzQSU1QiU1RCUyQyUyMnN0ZXBzJTIyJTNBMTYlMkMlMjJkaXZpc2lvbiUyMiUzQTE2JTJDJTIyY3VzdG9tQ3VlcyUyMiUzQWZhbHNlJTdEJTVEJTdE",
  },
];

// Global runtime state for transport, UI mode, selection, and all tile data.
// This object is the single source of truth for rendering and URL persistence.
const state = {
  bpm: 120,
  division: BASE_DIVISION,
  isPlaying: false,
  isRecording: false,
  isEditMode: true,
  globalStep: 0,
  selectedIndex: 0,
  selectedCue: 0,
  selectedStep: null,
  tiles: Array.from({ length: TILE_COUNT }, () => getDefaultTileState()),
};

const gridEl = document.getElementById("grid");
const appEl = document.querySelector(".app");
const bpmInput = document.getElementById("bpm");
const presentModeBtn = document.getElementById("present-mode");
const editModeBtn = document.getElementById("edit-mode");
const playToggleBtn = document.getElementById("play-toggle");
const loopToggleBtn = document.getElementById("loop-toggle");
const tapTempoBtn = document.getElementById("tap-tempo");
const metronomeToggleBtn = document.getElementById("metronome-toggle");
const metronomeVolumeInput = document.getElementById("metronome-volume");
const newSessionBtn = document.getElementById("new-session");
const shareBtn = document.getElementById("share");
const helpToggleBtn = document.getElementById("help-toggle");
const communityToggleBtn = document.getElementById("community-toggle");
const helpPanel = document.getElementById("help-panel");
const helpCloseBtn = document.getElementById("help-close");
const communityPanel = document.getElementById("community-panel");
const communityCloseBtn = document.getElementById("community-close");
const communityDiscordLink = document.getElementById("community-discord-link");
const communityPopupList = document.getElementById("community-popup-list");
const mobileBlocker = document.getElementById("mobile-blocker");
const showcaseToggleBtn = document.getElementById("showcase-toggle");
const showcaseSidebar = document.getElementById("showcase-sidebar");
const showcaseCloseBtn = document.getElementById("showcase-close");
const showcaseBackdrop = document.getElementById("showcase-backdrop");
const showcaseAddCurrentBtn = document.getElementById("showcase-add-current");
const showcaseAddBtn = document.getElementById("showcase-add");
const showcaseNameInput = document.getElementById("showcase-name");
const showcaseUrlInput = document.getElementById("showcase-url");
const showcaseList = document.getElementById("showcase-list");
const shareHint = document.getElementById("share-hint");
const statusEl = document.getElementById("status");
const tileContextMenu = document.getElementById("tile-context-menu");
const tileCopyBtn = document.getElementById("tile-copy-btn");
const tilePasteBtn = document.getElementById("tile-paste-btn");
const tileUrlPopup = document.getElementById("tile-url-popup");
const tileUrlInput = document.getElementById("tile-url-input");
const tileUrlSaveBtn = document.getElementById("tile-url-save");
const tileUrlCancelBtn = document.getElementById("tile-url-cancel");

const tileEls = [];
const stepEls = [];
let transportTimer = null;
let shareResetTimer = null;
let tapTimes = [];
let showcaseLinks = [];
let newBtnResetTimer = null;
let metronomeEnabled = false;
let metronomeContext = null;
let skipNextMetronome = false;
let metronomeVolume = 50;
let historyPast = [];
let historyFuture = [];
let isApplyingHistory = false;
let tileClipboard = null;
let contextTileIndex = null;
let activeUrlTileIndex = null;
let tooltipEl = null;
let tooltipTimer = null;
let tooltipTarget = null;

function init() {
  loadShowcaseLinks();
  loadFromUrl();
  buildGrid();
  resetHistory();
  bindGlobalControls();
  initGlobalTooltips();
  initTooltips();
  updateTransportButton();
  updateStatus();
  updateMobileBlocker();
  renderShowcaseLinks();
  renderCommunityPanelLinks();
}

function initGlobalTooltips() {
  // Global transport tooltips are configured once here; tile-level tooltips
  // are attached when each tile is built.
  setTooltip(presentModeBtn, "Show mode\nShortcut: Tab toggles Show/Edit");
  setTooltip(editModeBtn, "Edit mode\nShortcut: Tab toggles Show/Edit");
  setTooltip(playToggleBtn, "Global play / stop\nShortcut: Space");
  setTooltip(loopToggleBtn, "Loop record mode\nON: cue performance writes into sequence\nShortcut: L");
  setTooltip(bpmInput, "Global BPM (40-240)");
  setTooltip(tapTempoBtn, "Tap tempo\nClick repeatedly to detect BPM");
  setTooltip(metronomeToggleBtn, "Click metronome on / off\nShortcut: C");
  setTooltip(metronomeVolumeInput, "Click metronome volume");
}

function buildGrid() {
  gridEl.innerHTML = "";
  tileEls.length = 0;
  stepEls.length = 0;

  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.destroy) {
      tile.player.destroy();
    }
    tile.player = null;
  });

  for (let i = 0; i < TILE_COUNT; i += 1) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = String(i);
    if (i === state.selectedIndex) tile.classList.add("selected");
    if (!state.isEditMode) tile.classList.add("collapsed");
    if (i >= FREE_TILES) tile.classList.add("locked");

    const frame = document.createElement("div");
    frame.className = "player-frame";
    const playerSlot = document.createElement("div");
    playerSlot.id = `player-${i}`;
    const clearVideoBtn = document.createElement("button");
    clearVideoBtn.className = "video-clear-btn";
    clearVideoBtn.type = "button";
    clearVideoBtn.textContent = "×";
    clearVideoBtn.setAttribute("aria-label", `Clear video from tile ${i + 1}`);
    setTooltip(clearVideoBtn, "Clear video from tile");
    const emptyHint = document.createElement("div");
    emptyHint.className = "video-empty-hint";
    emptyHint.textContent = "Load URL or click Random to add a video";
    frame.appendChild(playerSlot);
    frame.appendChild(clearVideoBtn);
    frame.appendChild(emptyHint);

    const controls = document.createElement("div");
    controls.className = "tile-controls";

    const sourceRow = document.createElement("div");
    sourceRow.className = "url-row editable-only";
    const poolSelect = document.createElement("select");
    poolSelect.className = "tile-source-pool";
    setTooltip(poolSelect, "Style pool for random video selection");
    VIDEO_POOL_OPTIONS.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.key;
      option.textContent = item.label;
      poolSelect.appendChild(option);
    });
    poolSelect.value = state.tiles[i].videoPool in RANDOM_VIDEO_POOLS ? state.tiles[i].videoPool : "top_hits";
    const randomBtn = document.createElement("button");
    randomBtn.textContent = "Random";
    randomBtn.className = "load-btn";
    setTooltip(randomBtn, "Load a random video from selected style pool");
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.className = "load-btn";
    setTooltip(backBtn, "Load previous video for this tile");
    const urlBtn = document.createElement("button");
    urlBtn.textContent = "URL";
    urlBtn.className = "load-btn";
    setTooltip(urlBtn, "View or replace tile URL");
    sourceRow.append(poolSelect, randomBtn, backBtn, urlBtn);

    const perfRow = document.createElement("div");
    perfRow.className = "status-row cue-row editable-only";
    const perfPlayBtn = document.createElement("button");
    perfPlayBtn.className = "perf-play-btn";
    setTooltip(
      perfPlayBtn,
      `Play / pause tile\nShortcut: ${TILE_PLAY_KEYS[i].toUpperCase()}`
    );
    perfPlayBtn.innerHTML = `▶ <span class="hotkey">${TILE_PLAY_KEYS[i].toUpperCase()}</span>`;
    const perfVolLabel = document.createElement("div");
    perfVolLabel.className = "mini-label";
    perfVolLabel.textContent = "Volume";
    const perfVolInput = document.createElement("input");
    perfVolInput.className = "perf-vol-input";
    perfVolInput.type = "range";
    perfVolInput.min = "0";
    perfVolInput.max = "100";
    perfVolInput.step = "1";
    setTooltip(perfVolInput, "Tile master volume");
    perfVolInput.value = String(state.tiles[i].masterVolume ?? 100);
    const perfSpeedSelect = document.createElement("select");
    perfSpeedSelect.className = "perf-speed-select";
    setTooltip(perfSpeedSelect, "Tile playback speed");
    perfSpeedSelect.innerHTML = `
      <option value="0.5">0.5x</option>
      <option value="0.75">0.75x</option>
      <option value="1">1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2x</option>
    `;
    perfSpeedSelect.value = String(state.tiles[i].playbackRate ?? 1);
    perfRow.append(perfPlayBtn, perfVolLabel, perfVolInput, perfSpeedSelect);

    const stepsRow = document.createElement("div");
    stepsRow.className = "status-row editable-only seq-config-row";
    const stepsLabel = document.createElement("div");
    stepsLabel.textContent = "Steps";
    const stepsInput = document.createElement("input");
    stepsInput.className = "tile-num-input";
    stepsInput.type = "number";
    stepsInput.min = "1";
    stepsInput.max = "128";
    stepsInput.value = String(state.tiles[i].steps);
    setTooltip(stepsInput, "Number of steps in this tile sequence");
    stepsRow.append(stepsLabel, stepsInput);

    const divisionRow = document.createElement("div");
    divisionRow.className = "status-row editable-only seq-config-row";
    const divisionLabel = document.createElement("div");
    divisionLabel.className = "time-div-label";
    divisionLabel.textContent = "Time Div";
    const divisionSelect = document.createElement("select");
    divisionSelect.className = "tile-select-input";
    setTooltip(divisionSelect, "Step time division");
    divisionSelect.innerHTML = `
      <option value="16">16ths</option>
      <option value="8">8ths</option>
      <option value="4">Beats</option>
    `;
    divisionSelect.value = String(state.tiles[i].division || BASE_DIVISION);
    divisionRow.append(divisionLabel, divisionSelect);

    const legend = null;

    const liveTitle = document.createElement("div");
    liveTitle.className = "section-title editable-only";
    liveTitle.textContent = "Current Cue Point";

    const cueSection = document.createElement("div");
    cueSection.className = "status-row cue-row editable-only";
    const cueSelect = document.createElement("select");
    cueSelect.className = "cue-select tile-select-input";
    setTooltip(cueSelect, "Currently selected cue index\nShortcut: 0-9");
    for (let c = 0; c <= 9; c += 1) {
      const option = document.createElement("option");
      option.value = String(c);
      option.textContent = String(c);
      cueSelect.appendChild(option);
    }

    const cueSecLabel = document.createElement("div");
    cueSecLabel.className = "mini-label";
    cueSecLabel.textContent = "Sec";
    const cueSecInput = document.createElement("input");
    cueSecInput.className = "tile-num-input cue-sec-input";
    cueSecInput.type = "number";
    cueSecInput.min = "0";
    cueSecInput.step = "0.01";
    setTooltip(cueSecInput, "Cue video timestamp in seconds\nShortcut: Arrow keys");

    const cueVolLabel = document.createElement("div");
    cueVolLabel.className = "mini-label";
    cueVolLabel.textContent = "Vol";
    const cueVolInput = document.createElement("input");
    cueVolInput.className = "tile-num-input";
    cueVolInput.type = "number";
    cueVolInput.min = "0";
    cueVolInput.max = "100";
    cueVolInput.step = "1";
    setTooltip(cueVolInput, "Cue volume percent\nShortcut: Option + Arrow keys");
    const cueShiftLabel = document.createElement("div");
    cueShiftLabel.className = "mini-label";
    cueShiftLabel.textContent = "Sh%";
    const cueShiftInput = document.createElement("input");
    cueShiftInput.className = "tile-num-input cue-shift-input";
    cueShiftInput.type = "number";
    cueShiftInput.min = "-100";
    cueShiftInput.max = "100";
    cueShiftInput.step = "1";
    setTooltip(cueShiftInput, "Cue timing shift percent (-100 to 100)");

    cueSection.append(cueSelect, cueSecLabel, cueSecInput, cueVolLabel, cueVolInput, cueShiftLabel, cueShiftInput);

    const seqTitle = document.createElement("div");
    seqTitle.className = "section-title editable-only";
    seqTitle.textContent = "Sequencer";

    const clearRow = document.createElement("div");
    clearRow.className = "status-row editable-only seq-config-row";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.className = "clear-btn";
    setTooltip(clearBtn, "Clear all steps in this tile sequence\nShortcut: Shift + Delete");
    clearBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearActions(i);
    });
    clearRow.append(stepsLabel, stepsInput, divisionLabel, divisionSelect, clearBtn);

    const stepIndicator = document.createElement("div");
    stepIndicator.className = "step-indicator";
    const totalSteps = state.tiles[i].steps;
    stepIndicator.style.gridTemplateColumns = `repeat(${totalSteps}, minmax(0, 1fr))`;
    const stepDots = [];
    for (let s = 0; s < totalSteps; s += 1) {
      const dot = document.createElement("div");
      dot.className = "step";
      if (s % 4 === 0) dot.classList.add("beat-step");
      dot.dataset.step = String(s);
      setTooltip(dot, `Step ${s + 1}\nShortcut: Click to select`);
      stepIndicator.appendChild(dot);
      stepDots.push(dot);
    }

    const lockedOverlay = document.createElement("div");
    lockedOverlay.className = "locked-overlay";
    lockedOverlay.innerHTML = `
      <div><strong>Locked</strong></div>
      <div>Upgrade to unlock more tiles.</div>
      <button type="button">Upgrade</button>
    `;
    const upgradeBtn = lockedOverlay.querySelector("button");
    upgradeBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      window.alert("We are working on this expansion. Coming soon.");
    });

    controls.append(sourceRow, perfRow, liveTitle, cueSection, seqTitle, clearRow, stepIndicator);
    tile.append(frame, controls, lockedOverlay);
    gridEl.appendChild(tile);

    tileEls.push({
      tile,
      poolSelect,
      randomBtn,
      backBtn,
      urlBtn,
      perfPlayBtn,
      perfVolInput,
      perfSpeedSelect,
      stepsInput,
      divisionSelect,
      cueSelect,
      cueSecInput,
      cueVolInput,
      cueShiftInput,
      clearBtn,
      stepIndicator,
      stepDots,
    });
    stepEls.push(stepDots);

    tile.addEventListener("click", () => selectTile(i));
    clearVideoBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearTileVideo(i);
    });
    tile.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openTileContextMenu(i, event.clientX, event.clientY);
    });
    poolSelect.addEventListener("change", (event) => {
      event.stopPropagation();
      const key = poolSelect.value in RANDOM_VIDEO_POOLS ? poolSelect.value : "top_hits";
      state.tiles[i].videoPool = key;
      flashControl(poolSelect);
      saveToUrl();
      updateStatus();
    });
    randomBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      loadRandomVideo(i);
    });
    backBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      loadPreviousVideo(i);
    });
    urlBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openTileUrlPopup(i);
    });
    perfPlayBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleTilePlayPause(i, false);
    });
    perfVolInput.addEventListener("input", (event) => {
      event.stopPropagation();
      const parsed = Number(perfVolInput.value);
      state.tiles[i].masterVolume = clamp(Number.isFinite(parsed) ? parsed : 100, 0, 100);
      flashControl(perfVolInput);
      applySelectedCueVolume(i);
      saveToUrl();
    });
    perfVolInput.addEventListener("change", () => pushHistorySnapshot());
    perfSpeedSelect.addEventListener("change", (event) => {
      event.stopPropagation();
      state.tiles[i].playbackRate = Number(perfSpeedSelect.value) || 1;
      state.tiles[i].player?.setPlaybackRate?.(state.tiles[i].playbackRate);
      flashControl(perfSpeedSelect);
      saveToUrl();
      pushHistorySnapshot();
    });
    cueSelect.addEventListener("change", (event) => {
      event.stopPropagation();
      selectTile(i);
      selectCue(Number(cueSelect.value));
      flashControl(cueSelect);
    });
    cueSecInput.addEventListener("input", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueSecInput.value);
      if (Number.isNaN(parsed)) return;
      const value = Math.max(0, parsed);
      tile.cues[state.selectedCue] = value;
      tile.customCues = true;
      flashControl(cueSecInput);
      saveToUrl();
    });
    cueSecInput.addEventListener("change", () => {
      updateTileDisplays();
      pushHistorySnapshot();
    });
    cueVolInput.addEventListener("input", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueVolInput.value);
      if (Number.isNaN(parsed)) return;
      tile.cueVolumes[state.selectedCue] = clamp(parsed, 0, 100);
      flashControl(cueVolInput);
      applySelectedCueVolume(i);
      saveToUrl();
    });
    cueVolInput.addEventListener("change", () => {
      updateTileDisplays();
      pushHistorySnapshot();
    });
    cueShiftInput.addEventListener("input", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueShiftInput.value);
      if (Number.isNaN(parsed)) return;
      tile.cueShifts[state.selectedCue] = clamp(parsed, -100, 100);
      flashControl(cueShiftInput);
      saveToUrl();
    });
    cueShiftInput.addEventListener("change", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueShiftInput.value);
      tile.cueShifts[state.selectedCue] = clamp(Number.isFinite(parsed) ? parsed : 0, -100, 100);
      cueShiftInput.value = String(Math.round(tile.cueShifts[state.selectedCue] || 0));
      saveToUrl();
      pushHistorySnapshot();
    });
    stepsInput.addEventListener("change", () => {
      const value = clamp(Number(stepsInput.value) || 16, 1, 128);
      stepsInput.value = String(value);
      state.tiles[i].steps = value;
      if (state.selectedStep !== null && state.selectedStep >= value) {
        state.selectedStep = null;
      }
      resizeActions(state.tiles[i]);
      rebuildTileSteps(i);
      flashControl(stepsInput);
      saveToUrl();
      pushHistorySnapshot();
    });
    divisionSelect.addEventListener("change", () => {
      const value = Number(divisionSelect.value) || BASE_DIVISION;
      state.tiles[i].division = value;
      updateStepIndicators();
      flashControl(divisionSelect);
      saveToUrl();
      pushHistorySnapshot();
    });
    stepDots.forEach((dot, stepIdx) => {
      dot.addEventListener("click", (event) => {
        event.stopPropagation();
        selectTile(i);
        toggleSelectedStep(stepIdx);
      });
    });
  }

  updateTileDisplays();
  recreatePlayers();
}

function bindGlobalControls() {
  bpmInput.addEventListener("change", () => {
    state.bpm = clamp(Number(bpmInput.value) || 120, 40, 240);
    bpmInput.value = state.bpm;
    if (state.isPlaying) {
      skipNextMetronome = true;
      restartTransport(false);
    }
    saveToUrl();
    pushHistorySnapshot();
  });

  playToggleBtn.addEventListener("click", () => togglePlay());

  presentModeBtn.addEventListener("click", () => {
    state.isEditMode = false;
    tileEls.forEach((entry) => entry.tile.classList.add("collapsed"));
    updateTransportButton();
  });

  editModeBtn.addEventListener("click", () => {
    state.isEditMode = true;
    tileEls.forEach((entry) => entry.tile.classList.remove("collapsed"));
    updateTransportButton();
  });

  loopToggleBtn.addEventListener("click", () => toggleLoop());
  tapTempoBtn?.addEventListener("click", () => {
    tapTempoBtn.classList.remove("flash");
    void tapTempoBtn.offsetWidth;
    tapTempoBtn.classList.add("flash");
    tapTempo();
  });
  metronomeToggleBtn?.addEventListener("click", () => {
    metronomeEnabled = !metronomeEnabled;
    metronomeToggleBtn.classList.toggle("active", metronomeEnabled);
    if (metronomeEnabled) {
      startMetronome();
    } else {
      stopMetronome();
    }
  });
  metronomeVolumeInput?.addEventListener("input", () => {
    metronomeVolume = clamp(Number(metronomeVolumeInput.value) || 0, 0, 100);
  });
  newSessionBtn.addEventListener("click", () => {
    newSessionBtn.classList.add("clicked");
    clearTimeout(newBtnResetTimer);
    newBtnResetTimer = setTimeout(() => newSessionBtn.classList.remove("clicked"), 220);
    startNewSession();
  });

  shareBtn.addEventListener("click", async () => {
    saveToUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareBtn.classList.add("copied");
      shareBtn.textContent = "✓";
      showShareHint("Session copied to clipboard - paste anywhere to share or save your session");
      clearTimeout(shareResetTimer);
      shareResetTimer = setTimeout(() => {
        shareBtn.classList.remove("copied");
        shareBtn.innerHTML =
          '<img class="share-icon" src="assets/share-icon.png" alt="" aria-hidden="true" />';
      }, 1300);
    } catch (error) {
      statusEl.textContent = "Could not copy link. Select the URL manually.";
    }
  });

  helpToggleBtn.addEventListener("click", () => {
    helpPanel.classList.add("show");
    helpPanel.setAttribute("aria-hidden", "false");
  });
  communityToggleBtn?.addEventListener("click", () => {
    setCommunityOpen(true);
  });
  communityToggleBtn?.addEventListener("pointerup", () => {
    setCommunityOpen(true);
  });

  helpCloseBtn.addEventListener("click", () => {
    helpPanel.classList.remove("show");
    helpPanel.setAttribute("aria-hidden", "true");
  });

  helpPanel.addEventListener("click", (event) => {
    if (event.target === helpPanel) {
      helpPanel.classList.remove("show");
      helpPanel.setAttribute("aria-hidden", "true");
    }
  });
  communityCloseBtn?.addEventListener("click", () => setCommunityOpen(false));
  communityPanel?.addEventListener("click", (event) => {
    if (event.target === communityPanel) {
      setCommunityOpen(false);
    }
  });

  showcaseToggleBtn?.addEventListener("click", () => setShowcaseOpen(true));
  showcaseToggleBtn?.addEventListener("pointerup", () => setShowcaseOpen(true));
  showcaseCloseBtn?.addEventListener("click", () => setShowcaseOpen(false));
  showcaseBackdrop?.addEventListener("click", () => setShowcaseOpen(false));
  showcaseAddCurrentBtn?.addEventListener("click", () => {
    addShowcaseLink(generateSessionName(), window.location.href);
  });
  showcaseAddBtn?.addEventListener("click", () => {
    const name = (showcaseNameInput?.value || "").trim();
    const url = (showcaseUrlInput?.value || "").trim();
    addShowcaseLink(name || `Session ${showcaseLinks.length + 1}`, url);
  });
  showcaseUrlInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      showcaseAddBtn?.click();
    }
  });
  tileCopyBtn?.addEventListener("click", () => {
    if (contextTileIndex === null) return;
    tileClipboard = getTileSnapshot(contextTileIndex);
    hideTileContextMenu();
    statusEl.textContent = `Copied tile ${contextTileIndex + 1}`;
  });
  tilePasteBtn?.addEventListener("click", () => {
    if (contextTileIndex === null || !tileClipboard) return;
    applyTileSnapshot(contextTileIndex, tileClipboard);
    hideTileContextMenu();
    statusEl.textContent = `Pasted into tile ${contextTileIndex + 1}`;
  });
  document.addEventListener("click", (event) => {
    if (!tileContextMenu?.classList.contains("show")) return;
    if (tileContextMenu.contains(event.target)) return;
    hideTileContextMenu();
  });
  document.addEventListener("contextmenu", (event) => {
    if (!tileContextMenu?.classList.contains("show")) return;
    if (tileContextMenu.contains(event.target)) {
      event.preventDefault();
      return;
    }
    hideTileContextMenu();
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", updateMobileBlocker);
  window.addEventListener("resize", hideTileContextMenu);
  appEl?.addEventListener("input", (event) => {
    if (event.target === shareBtn) return;
    hideShareHint();
  });
  appEl?.addEventListener("change", (event) => {
    if (event.target === shareBtn) return;
    hideShareHint();
  });
  appEl?.addEventListener("click", (event) => {
    if (event.target === shareBtn) return;
    hideShareHint();
  });
  tileUrlSaveBtn?.addEventListener("click", () => {
    if (activeUrlTileIndex === null) return;
    loadVideo(activeUrlTileIndex, tileUrlInput?.value || "");
    closeTileUrlPopup();
  });
  tileUrlCancelBtn?.addEventListener("click", () => closeTileUrlPopup());
  tileUrlPopup?.addEventListener("click", (event) => {
    if (event.target === tileUrlPopup) {
      closeTileUrlPopup();
    }
  });
  tileUrlInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      tileUrlSaveBtn?.click();
    }
  });
}

function handleKeyDown(event) {
  if (event.key === "Escape" && tileUrlPopup?.classList.contains("show")) {
    event.preventDefault();
    closeTileUrlPopup();
    return;
  }
  if (event.key === "Escape" && tileContextMenu?.classList.contains("show")) {
    event.preventDefault();
    hideTileContextMenu();
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    state.isEditMode = !state.isEditMode;
    tileEls.forEach((entry) => entry.tile.classList.toggle("collapsed", !state.isEditMode));
    updateTransportButton();
    return;
  }
  if (event.key === "Escape") {
    const active = document.activeElement;
    if (
      active &&
      (active instanceof HTMLInputElement ||
        active instanceof HTMLSelectElement ||
        active instanceof HTMLTextAreaElement)
    ) {
      event.preventDefault();
      active.blur();
      return;
    }
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      redoHistory();
    } else {
      undoHistory();
    }
    return;
  }

  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }
  if (event.key.toLowerCase() === "c") {
    event.preventDefault();
    metronomeEnabled = !metronomeEnabled;
    metronomeToggleBtn?.classList.toggle("active", metronomeEnabled);
    if (metronomeEnabled && !metronomeContext) {
      metronomeContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return;
  }
  if (event.key === "Escape" && communityPanel?.classList.contains("show")) {
    event.preventDefault();
    setCommunityOpen(false);
    return;
  }
  if (event.key === "Escape" && showcaseSidebar?.classList.contains("show")) {
    event.preventDefault();
    setShowcaseOpen(false);
    return;
  }
  if (event.key === "Escape" && state.selectedStep !== null) {
    event.preventDefault();
    state.selectedStep = null;
    updateStepIndicators();
    return;
  }
  const tileHotkeyIndex = TILE_PLAY_KEYS.indexOf(event.key.toLowerCase());
  if (tileHotkeyIndex !== -1) {
    event.preventDefault();
    if (event.repeat) return;
    selectTile(tileHotkeyIndex);
    if (!event.shiftKey) {
      toggleTilePlayPause(tileHotkeyIndex, false);
    }
    return;
  }
  if (event.shiftKey && (event.key === "Delete" || event.key === "Backspace")) {
    clearActions(state.selectedIndex);
    event.preventDefault();
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
    return;
  }
  if (event.key.toLowerCase() === "l") {
    event.preventDefault();
    toggleLoop();
    return;
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    if (state.selectedStep !== null) {
      clearStep(state.selectedIndex, state.selectedStep);
    } else if (state.isRecording) {
      const tile = state.tiles[state.selectedIndex];
      const localStep = getLocalStep(tile);
      clearStep(state.selectedIndex, localStep);
    }
    event.preventDefault();
    return;
  }
  if (state.selectedStep !== null && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    moveSelectedStep(delta);
    return;
  }
  if (state.selectedStep !== null && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
    event.preventDefault();
    state.selectedStep = null;
    updateStepIndicators();
    return;
  }
  const numberKey = getNumberKey(event);
  if (numberKey !== null) {
    if (event.metaKey) {
      if (state.selectedStep === null) {
        setCue(state.selectedIndex, numberKey);
      } else {
        setStepAction(state.selectedIndex, state.selectedStep, { type: "seek", cueIndex: numberKey });
        selectCue(numberKey);
      }
    } else {
      if (state.selectedStep !== null) {
        setStepAction(state.selectedIndex, state.selectedStep, { type: "seek", cueIndex: numberKey });
        selectCue(numberKey);
      } else {
        triggerAction(state.selectedIndex, { type: "seek", cueIndex: numberKey }, state.isRecording);
        selectCue(numberKey);
      }
    }
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    let step = event.shiftKey ? NUDGE_LR_FINE : NUDGE_LR;
    if (event.altKey) {
      adjustCueVolumeFromArrow(event.key);
      event.preventDefault();
      return;
    }
    nudgeCue(state.selectedIndex, state.selectedCue, delta * step);
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    const delta = event.key === "ArrowUp" ? 1 : -1;
    if (event.altKey) {
      adjustCueVolumeFromArrow(event.key);
      event.preventDefault();
      return;
    }
    const step = event.shiftKey ? NUDGE_UD_FINE : NUDGE_UD;
    nudgeCue(state.selectedIndex, state.selectedCue, delta * step);
    event.preventDefault();
    return;
  }

  if (event.key.toLowerCase() === "m") {
    if (state.selectedStep !== null) {
      toggleMuteStep(state.selectedIndex, state.selectedStep);
    } else if (state.isRecording) {
      triggerAction(state.selectedIndex, { type: "mute-step" }, true);
    }
    event.preventDefault();
  }
}

function selectTile(index) {
  state.selectedIndex = index;
  state.selectedStep = null;
  tileEls.forEach((entry, idx) => {
    entry.tile.classList.toggle("selected", idx === index);
  });
  updateTileDisplays();
}

function toggleSelectedStep(stepIdx) {
  if (state.selectedStep === stepIdx) {
    state.selectedStep = null;
  } else {
    state.selectedStep = stepIdx;
  }
  updateStepIndicators();
}

function moveSelectedStep(delta) {
  const tile = state.tiles[state.selectedIndex];
  const totalSteps = tile.steps;
  if (totalSteps <= 0) return;
  const next = (state.selectedStep + delta + totalSteps) % totalSteps;
  state.selectedStep = next;
  updateStepIndicators();
}

function moveTileSelection(direction) {
  const cols = 4;
  let next = state.selectedIndex;
  if (direction === "ArrowLeft") next -= 1;
  if (direction === "ArrowRight") next += 1;
  if (direction === "ArrowUp") next -= cols;
  if (direction === "ArrowDown") next += cols;
  next = Math.max(0, Math.min(TILE_COUNT - 1, next));
  selectTile(next);
}

function getNumberKey(event) {
  if (event.code && event.code.startsWith("Digit")) {
    const digit = Number(event.code.replace("Digit", ""));
    return Number.isNaN(digit) ? null : digit;
  }
  if (event.code && event.code.startsWith("Numpad")) {
    const digit = Number(event.code.replace("Numpad", ""));
    return Number.isNaN(digit) ? null : digit;
  }
  const fallback = Number(event.key);
  return Number.isNaN(fallback) ? null : fallback;
}

function selectCue(cueIndex) {
  state.selectedCue = cueIndex;
  applySelectedCueVolume(state.selectedIndex);
  updateTileDisplays();
  flashControl(tileEls[state.selectedIndex]?.cueSelect);
  updateStatus();
}

function setCue(index, cueIndex) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  const currentTime = player.getCurrentTime?.() ?? 0;
  tile.cues[cueIndex] = currentTime;
  tile.customCues = true;
  state.selectedCue = cueIndex;
  updateTileDisplays();
  flashControl(tileEls[index]?.cueSecInput);
  saveToUrl();
  pushHistorySnapshot();
}

function nudgeCue(index, cueIndex, delta) {
  const tile = state.tiles[index];
  tile.cues[cueIndex] = Math.max(0, tile.cues[cueIndex] + delta);
  updateTileDisplays();
  flashControl(tileEls[index]?.cueSecInput);
  saveToUrl();
  pushHistorySnapshot();
}

function jumpToCue(index, cueIndex) {
  state.selectedCue = cueIndex;
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  const time = tile.cues[cueIndex] || 0;
  player.seekTo(time, true);
  updateTileDisplays();
}

function loadVideo(index, url, options = {}) {
  const normalizedUrl = url.trim();
  const videoId = parseVideoId(normalizedUrl);
  const playlistId = parsePlaylistId(normalizedUrl);
  if (!videoId && !playlistId) {
    statusEl.textContent = "Invalid YouTube URL.";
    return;
  }

  const tile = state.tiles[index];
  const trackHistory = options.trackHistory !== false;
  if (trackHistory && tile.videoUrl && tile.videoUrl !== normalizedUrl) {
    tile.videoHistory.push(tile.videoUrl);
    if (tile.videoHistory.length > 50) tile.videoHistory.shift();
  }
  tile.videoUrl = normalizedUrl;
  tile.videoId = videoId || "";
  if (options.poolKey && options.poolKey in RANDOM_VIDEO_POOLS) {
    tile.videoPool = options.poolKey;
  }
  tile.customCues = false;
  tile.cues = Array(10).fill(0);
  tile.cueVolumes = Array(10).fill(100);

  if (tile.player) {
    if (videoId) {
      tile.player.loadVideoById(videoId);
    } else if (playlistId) {
      tile.player.loadPlaylist?.({
        listType: "playlist",
        list: playlistId,
        index: 0,
      });
    }
    queueDefaultCues(index);
  } else if (window.YT && window.YT.Player) {
    const playerVars = {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      controls: 0,
      disablekb: 1,
    };
    if (playlistId && !videoId) {
      playerVars.listType = "playlist";
      playerVars.list = playlistId;
    }
    tile.player = new window.YT.Player(`player-${index}`, {
      videoId: videoId || undefined,
      playerVars,
      events: {
        onReady: () => maybeSetDefaultCues(index),
        onStateChange: (event) => handlePlayerState(index, event),
      },
    });
  }

  updateTileDisplays();
  saveToUrl();
}

function clearTileVideo(index) {
  const tile = state.tiles[index];
  if (!tile) return;
  if (tile.player?.destroy) {
    tile.player.destroy();
  }
  tile.player = null;
  tile.videoUrl = "";
  tile.videoId = "";
  tile.videoHistory = [];
  tile.customCues = false;
  tile.cues = Array(10).fill(0);
  tile.cueVolumes = Array(10).fill(100);
  tile.cueShifts = Array(10).fill(0);
  tile.isClipPlaying = false;
  tile.desiredClipPlaying = null;
  tile.muted = false;
  if (Array.isArray(tile.pendingActionTimers)) {
    tile.pendingActionTimers.forEach((timerId) => clearTimeout(timerId));
  }
  tile.pendingActionTimers = [];

  const entry = tileEls[index];
  const frame = entry?.tile?.querySelector(".player-frame");
  if (frame) {
    const iframe = frame.querySelector("iframe");
    if (iframe) iframe.remove();
    let slot = frame.querySelector(`#player-${index}`);
    if (!slot) {
      slot = document.createElement("div");
      slot.id = `player-${index}`;
      frame.prepend(slot);
    }
    slot.innerHTML = "";
  }

  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function loadRandomVideo(index) {
  const tile = state.tiles[index];
  const poolKey = tile.videoPool in RANDOM_VIDEO_POOLS ? tile.videoPool : "top_hits";
  const selectedPool = RANDOM_VIDEO_POOLS[poolKey];
  if (!selectedPool.length) return;
  const current = tile.videoUrl;
  let nextUrl = selectedPool[Math.floor(Math.random() * selectedPool.length)];
  if (selectedPool.length > 1 && nextUrl === current) {
    nextUrl = selectedPool[(selectedPool.indexOf(nextUrl) + 1) % selectedPool.length];
  }
  loadVideo(index, nextUrl, { poolKey });
  updateTileDisplays();
  updateStatus();
}

function loadPreviousVideo(index) {
  const tile = state.tiles[index];
  if (!tile.videoHistory.length) {
    statusEl.textContent = `Tile ${index + 1} has no previous video yet.`;
    return;
  }
  const previousUrl = tile.videoHistory.pop();
  loadVideo(index, previousUrl, { trackHistory: false });
}

function openTileUrlPopup(index) {
  if (!tileUrlPopup || !tileUrlInput) return;
  selectTile(index);
  activeUrlTileIndex = index;
  tileUrlInput.value = state.tiles[index].videoUrl || "";
  tileUrlPopup.classList.add("show");
  tileUrlPopup.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    tileUrlInput.focus();
    tileUrlInput.select();
  }, 0);
}

function closeTileUrlPopup() {
  if (!tileUrlPopup) return;
  tileUrlPopup.classList.remove("show");
  tileUrlPopup.setAttribute("aria-hidden", "true");
  activeUrlTileIndex = null;
}

function getPoolLabel(poolKey) {
  const item = VIDEO_POOL_OPTIONS.find((option) => option.key === poolKey);
  return item ? item.label : "Top 100 hits";
}

function parsePoolKey(value) {
  return typeof value === "string" && value in RANDOM_VIDEO_POOLS ? value : "top_hits";
}

function getDefaultTileState() {
  return {
    videoUrl: "",
    videoId: "",
    videoPool: "top_hits",
    videoHistory: [],
    player: null,
    cues: Array(10).fill(0),
    cueVolumes: Array(10).fill(100),
    cueShifts: Array(10).fill(0),
    masterVolume: 100,
    playbackRate: 1,
    isClipPlaying: false,
    desiredClipPlaying: null,
    actions: Array.from({ length: 16 }, () => []),
    muted: false,
    steps: 16,
    division: BASE_DIVISION,
    customCues: false,
    pendingActionTimers: [],
  };
}

function normalizeTileState(rawTile, fallbackPool = "top_hits") {
  const tile = getDefaultTileState();
  const videoUrl = rawTile?.videoUrl || "";
  tile.videoUrl = videoUrl;
  tile.videoId = parseVideoId(videoUrl) || "";
  tile.videoPool = parsePoolKey(rawTile?.videoPool || fallbackPool);
  tile.videoHistory = Array.isArray(rawTile?.videoHistory)
    ? rawTile.videoHistory.filter((item) => typeof item === "string").slice(-50)
    : [];
  tile.cues = Array.isArray(rawTile?.cues) ? rawTile.cues.slice(0, 10) : tile.cues;
  while (tile.cues.length < 10) tile.cues.push(0);
  tile.cueVolumes = Array.isArray(rawTile?.cueVolumes) ? rawTile.cueVolumes.slice(0, 10) : tile.cueVolumes;
  while (tile.cueVolumes.length < 10) tile.cueVolumes.push(100);
  tile.cueShifts = Array.isArray(rawTile?.cueShifts) ? rawTile.cueShifts.slice(0, 10) : tile.cueShifts;
  while (tile.cueShifts.length < 10) tile.cueShifts.push(0);
  tile.masterVolume = clamp(Number(rawTile?.masterVolume ?? 100), 0, 100);
  tile.playbackRate = Number(rawTile?.playbackRate) || 1;
  tile.steps = clamp(Number(rawTile?.steps) || 16, 1, 128);
  tile.division = Number(rawTile?.division) || BASE_DIVISION;
  tile.customCues = Boolean(rawTile?.customCues);
  tile.pendingActionTimers = [];
  tile.actions = Array.from({ length: tile.steps }, (_, idx) => {
    const row = (rawTile?.actions && rawTile.actions[idx]) || [];
    return row.map((action) => ({ ...action }));
  });
  return tile;
}
function getTileSnapshot(index) {
  const tile = state.tiles[index];
  return {
    videoUrl: tile.videoUrl || "",
    videoId: parseVideoId(tile.videoUrl || ""),
    videoPool: parsePoolKey(tile.videoPool),
    videoHistory: Array.isArray(tile.videoHistory) ? tile.videoHistory.slice(-50) : [],
    cues: tile.cues.slice(0, 10),
    cueVolumes: tile.cueVolumes.slice(0, 10),
    cueShifts: tile.cueShifts.slice(0, 10),
    masterVolume: clamp(tile.masterVolume ?? 100, 0, 100),
    playbackRate: Number(tile.playbackRate) || 1,
    actions: (tile.actions || []).map((step) => (step || []).map((action) => ({ ...action }))),
    steps: clamp(Number(tile.steps) || 16, 1, 128),
    division: Number(tile.division) || BASE_DIVISION,
    customCues: Boolean(tile.customCues),
  };
}

function applyTileSnapshot(index, snapshot) {
  if (!snapshot) return;
  const tile = state.tiles[index];
  if (tile.player?.destroy) tile.player.destroy();

  tile.videoUrl = snapshot.videoUrl || "";
  tile.videoId = parseVideoId(tile.videoUrl || "");
  tile.videoPool = parsePoolKey(snapshot.videoPool);
  tile.videoHistory = Array.isArray(snapshot.videoHistory)
    ? snapshot.videoHistory.filter((item) => typeof item === "string").slice(-50)
    : [];
  tile.player = null;
  tile.cues = Array.isArray(snapshot.cues) ? snapshot.cues.slice(0, 10) : Array(10).fill(0);
  while (tile.cues.length < 10) tile.cues.push(0);
  tile.cueVolumes = Array.isArray(snapshot.cueVolumes) ? snapshot.cueVolumes.slice(0, 10) : Array(10).fill(100);
  while (tile.cueVolumes.length < 10) tile.cueVolumes.push(100);
  tile.cueShifts = Array.isArray(snapshot.cueShifts) ? snapshot.cueShifts.slice(0, 10) : Array(10).fill(0);
  while (tile.cueShifts.length < 10) tile.cueShifts.push(0);
  tile.masterVolume = clamp(Number(snapshot.masterVolume) || 100, 0, 100);
  tile.playbackRate = Number(snapshot.playbackRate) || 1;
  tile.steps = clamp(Number(snapshot.steps) || 16, 1, 128);
  tile.division = Number(snapshot.division) || BASE_DIVISION;
  tile.customCues = Boolean(snapshot.customCues);
  tile.pendingActionTimers = [];
  tile.actions = (snapshot.actions || []).map((step) => (step || []).map((action) => ({ ...action })));
  resizeActions(tile);
  tile.isClipPlaying = false;
  tile.desiredClipPlaying = null;
  tile.muted = false;

  if (tileEls[index]?.stepDots?.length !== tile.steps) {
    rebuildTileSteps(index);
  }

  const videoId = tile.videoId || parseVideoId(tile.videoUrl || "");
  const playlistId = parsePlaylistId(tile.videoUrl || "");
  if (window.YT && window.YT.Player && (videoId || playlistId)) {
    const playerVars = {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      controls: 0,
      disablekb: 1,
    };
    if (playlistId && !videoId) {
      playerVars.listType = "playlist";
      playerVars.list = playlistId;
    }
    tile.player = new window.YT.Player(`player-${index}`, {
      videoId: videoId || undefined,
      playerVars,
      events: {
        onReady: () => maybeSetDefaultCues(index),
        onStateChange: (event) => handlePlayerState(index, event),
      },
    });
  }

  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function hideTileContextMenu() {
  if (!tileContextMenu) return;
  tileContextMenu.classList.remove("show");
  tileContextMenu.setAttribute("aria-hidden", "true");
  contextTileIndex = null;
}

function openTileContextMenu(index, clientX, clientY) {
  if (!tileContextMenu || index >= FREE_TILES) return;
  selectTile(index);
  contextTileIndex = index;
  tileCopyBtn.disabled = false;
  tilePasteBtn.disabled = !tileClipboard;
  tileContextMenu.classList.add("show");
  tileContextMenu.setAttribute("aria-hidden", "false");
  const menuW = tileContextMenu.offsetWidth || 160;
  const menuH = tileContextMenu.offsetHeight || 84;
  const left = Math.min(clientX, window.innerWidth - menuW - 8);
  const top = Math.min(clientY, window.innerHeight - menuH - 8);
  tileContextMenu.style.left = `${Math.max(8, left)}px`;
  tileContextMenu.style.top = `${Math.max(8, top)}px`;
}

function triggerAction(index, action, addToLoop) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;

  // Always execute immediately for responsive performance.
  // Recording mode additionally writes the action into the current local step.
  performAction(tile, action);

  if (state.isRecording && addToLoop) {
    const localStep = getLocalStep(tile);
    tile.actions[localStep] = [action];
    updateTileDisplays();
    saveToUrl();
    pushHistorySnapshot();
  }
}

function performAction(tile, action) {
  const player = tile.player;
  if (!player) return;

  // Action payloads are intentionally small and serializable because they are
  // stored directly in URL session state and in undo/redo snapshots.
  switch (action.type) {
    case "play":
      player.playVideo();
      tile.isClipPlaying = true;
      tile.desiredClipPlaying = true;
      break;
    case "pause":
      player.pauseVideo();
      tile.isClipPlaying = false;
      tile.desiredClipPlaying = false;
      break;
    case "mute":
      player.mute();
      tile.muted = true;
      break;
    case "unmute":
      player.unMute();
      tile.muted = false;
      break;
    case "mute-step": {
      player.mute();
      tile.muted = true;
      const duration = getStepDurationMs(tile);
      if (tile.muteTimeout) clearTimeout(tile.muteTimeout);
      tile.muteTimeout = setTimeout(() => {
        player.unMute();
        tile.muted = false;
      }, duration);
      break;
    }
    case "seek": {
      const time = tile.cues[action.cueIndex] || 0;
      const cueVolume = clamp(tile.cueVolumes[action.cueIndex] ?? 100, 0, 100);
      const master = clamp(tile.masterVolume ?? 100, 0, 100);
      player.setVolume?.(clamp((cueVolume * master) / 100, 0, 100));
      player.seekTo(time, true);
      break;
    }
    default:
      break;
  }
}

function queueTileAction(tile, action, delayMs) {
  if (!Number.isFinite(delayMs) || delayMs <= 0) {
    performAction(tile, action);
    return;
  }
  const timerId = setTimeout(() => {
    if (!state.isPlaying) return;
    performAction(tile, action);
    tile.pendingActionTimers = (tile.pendingActionTimers || []).filter((id) => id !== timerId);
  }, delayMs);
  tile.pendingActionTimers = tile.pendingActionTimers || [];
  tile.pendingActionTimers.push(timerId);
}

function triggerTileStepActions(tile, localStep) {
  // Cue shift model:
  //  - Positive shift delays a cue within the current step window.
  //  - Negative shift pulls a cue from the next step into the end of this one.
  const totalSteps = Math.max(1, tile.steps || 1);
  const stepDuration = getStepDurationMs(tile);
  const actions = tile.actions[localStep] || [];
  actions.forEach((action) => {
    if (action.type !== "seek") {
      performAction(tile, action);
      return;
    }
    const shiftPercent = clamp(tile.cueShifts?.[action.cueIndex] ?? 0, -100, 100);
    if (shiftPercent < 0) return;
    queueTileAction(tile, action, (stepDuration * shiftPercent) / 100);
  });

  const nextStep = (localStep + 1) % totalSteps;
  const nextActions = tile.actions[nextStep] || [];
  nextActions.forEach((action) => {
    if (action.type !== "seek") return;
    const shiftPercent = clamp(tile.cueShifts?.[action.cueIndex] ?? 0, -100, 100);
    if (shiftPercent >= 0) return;
    const delayMs = (stepDuration * (100 + shiftPercent)) / 100;
    queueTileAction(tile, action, delayMs);
  });
}

function clearActions(index) {
  const tile = state.tiles[index];
  tile.actions = Array.from({ length: tile.steps }, () => []);
  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function clearStep(index, stepIdx) {
  const tile = state.tiles[index];
  tile.actions[stepIdx] = [];
  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function setStepAction(index, stepIdx, action) {
  const tile = state.tiles[index];
  tile.actions[stepIdx] = [action];
  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function toggleMuteStep(index, stepIdx) {
  const tile = state.tiles[index];
  const current = tile.actions[stepIdx] || [];
  const hasMute = current.some((action) => action.type === "mute-step");
  tile.actions[stepIdx] = hasMute ? [] : [{ type: "mute-step" }];
  updateTileDisplays();
  saveToUrl();
  pushHistorySnapshot();
}

function startTransport() {
  if (transportTimer) clearInterval(transportTimer);
  state.globalStep = -1;
  state.tiles.forEach((tile) => {
    if (Array.isArray(tile.pendingActionTimers)) {
      tile.pendingActionTimers.forEach((timerId) => clearTimeout(timerId));
    }
    tile.pendingActionTimers = [];
  });
  // The master clock always runs at 16th-note resolution (BASE_DIVISION).
  // Per-tile divisions derive from this clock via getStepAdvance().
  const interval = (60 / state.bpm) * (4 / BASE_DIVISION) * 1000;
  transportTimer = setInterval(tick, interval);
  updateStatus();
  if (metronomeEnabled) startMetronome();
}

function restartTransport(pauseVideos = true) {
  stopTransport(pauseVideos);
  if (state.isPlaying) startTransport();
}

function stopTransport(pauseVideos = true) {
  if (transportTimer) {
    clearInterval(transportTimer);
    transportTimer = null;
  }
  stopMetronome();
  state.tiles.forEach((tile) => {
    if (Array.isArray(tile.pendingActionTimers)) {
      tile.pendingActionTimers.forEach((timerId) => clearTimeout(timerId));
    }
    tile.pendingActionTimers = [];
  });
  if (pauseVideos) pauseAllVideos();
  updateStatus();
}

function tick() {
  state.globalStep += 1;
  if (metronomeEnabled && state.isPlaying) {
    const beatStep = BASE_DIVISION / 4;
    if (state.globalStep % beatStep === 0) {
      const isDownbeat = state.globalStep % BASE_DIVISION === 0;
      if (skipNextMetronome) {
        skipNextMetronome = false;
      } else {
        clickMetronome(isDownbeat);
      }
    }
  }
  state.tiles.forEach((tile) => {
    const stepAdvance = getStepAdvance(tile);
    const localStep = getLocalStep(tile);
    if (state.globalStep % stepAdvance === 0) {
      triggerTileStepActions(tile, localStep);
    }
  });
  updateStepIndicators();
}

function updateStepIndicators() {
  stepEls.forEach((dots, idx) => {
    const tile = state.tiles[idx];
    const localStep = getLocalStep(tile);
    const stepAdvance = getStepAdvance(tile);
    dots.forEach((dot, stepIdx) => {
      const isActive = stepIdx === localStep;
      if (isActive && state.isPlaying && state.globalStep % stepAdvance === 0) {
        flashStep(dot);
      }
      const hasAction = (state.tiles[idx].actions[stepIdx] || []).length > 0;
      dot.classList.toggle("has-action", hasAction);
      dot.textContent = "";
      const cueAction = (state.tiles[idx].actions[stepIdx] || []).find(
        (action) => action.type === "seek"
      );
      const muteAction = (state.tiles[idx].actions[stepIdx] || []).find(
        (action) => action.type === "mute-step"
      );
      if (cueAction) dot.textContent = String(cueAction.cueIndex);
      if (muteAction) dot.textContent = "M";
      if (cueAction) {
        setTooltip(dot, `Step ${stepIdx + 1}: Cue ${cueAction.cueIndex}\nShortcut: Delete clears step`);
      } else if (muteAction) {
        setTooltip(dot, `Step ${stepIdx + 1}: Mute\nShortcut: Delete clears step`);
      } else {
        setTooltip(dot, `Step ${stepIdx + 1}\nShortcut: Click to select`);
      }
      dot.classList.toggle(
        "selected-step",
        idx === state.selectedIndex && stepIdx === state.selectedStep
      );
    });
  });
}

function updateTileDisplays() {
  tileEls.forEach((entry, idx) => {
    const tile = state.tiles[idx];
    entry.poolSelect.value = parsePoolKey(tile.videoPool);
    entry.stepsInput.value = String(tile.steps);
    entry.divisionSelect.value = String(tile.division || BASE_DIVISION);
    entry.perfVolInput.value = String(clamp(tile.masterVolume ?? 100, 0, 100));
    entry.perfSpeedSelect.value = String(tile.playbackRate ?? 1);
    entry.perfPlayBtn.innerHTML = tile.isClipPlaying
      ? `❚❚ <span class="hotkey">${TILE_PLAY_KEYS[idx].toUpperCase()}</span>`
      : `▶ <span class="hotkey">${TILE_PLAY_KEYS[idx].toUpperCase()}</span>`;
    const cueIndex = idx === state.selectedIndex ? state.selectedCue : 0;
    const cueTime = tile.cues[cueIndex] || 0;
    entry.cueSelect.value = String(cueIndex);
    if (document.activeElement !== entry.cueSecInput) {
      entry.cueSecInput.value = cueTime.toFixed(2);
    }
    if (document.activeElement !== entry.cueVolInput) {
      entry.cueVolInput.value = String(clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100));
    }
    if (document.activeElement !== entry.cueShiftInput) {
      entry.cueShiftInput.value = String(Math.round(clamp(tile.cueShifts[cueIndex] ?? 0, -100, 100)));
    }
    const hasLoop = tile.actions.some((step) => step.length > 0);
    entry.clearBtn.classList.toggle("has-content", hasLoop);
    entry.tile.classList.toggle("recording", state.isRecording && idx === state.selectedIndex);
    entry.backBtn.disabled = tile.videoHistory.length === 0;
    entry.tile.classList.toggle("has-video", Boolean((tile.videoUrl || "").trim()));
  });

  updateStepIndicators();
  updateStatus();
}

function updateTransportButton() {
  playToggleBtn.innerHTML = state.isPlaying
    ? '<span class="transport-icon stop-icon">■</span><span class="transport-label">Stop</span>'
    : '<span class="transport-icon play-icon">▶</span><span class="transport-label">Play</span>';
  playToggleBtn.classList.toggle("active", state.isPlaying);
  loopToggleBtn.innerHTML = '<span class="transport-icon loop-dot">●</span><span class="transport-label">Loop</span>';
  presentModeBtn.classList.toggle("active", !state.isEditMode);
  editModeBtn.classList.toggle("active", state.isEditMode);
  appEl?.classList.toggle("performance", !state.isEditMode);
}

function updateStatus() {
  const tile = state.tiles[state.selectedIndex];
  const loopLabel = state.isRecording ? "Loop On" : "Loop Off";
  const playLabel = state.isPlaying ? "Playing" : "Stopped";
  const poolLabel = getPoolLabel(tile.videoPool);
  statusEl.textContent = `Selected tile ${state.selectedIndex + 1} • Cue ${state.selectedCue} • BPM ${state.bpm} • ${playLabel} • ${loopLabel} • Style ${poolLabel}`;
  loopToggleBtn.classList.toggle("active", state.isRecording);
}

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  if (state.isPlaying) {
    startTransport();
    playAllVideos();
  } else {
    stopTransport();
  }
  updateTransportButton();
}

function toggleLoop() {
  state.isRecording = !state.isRecording;
  loopToggleBtn.classList.toggle("active", state.isRecording);
  updateTileDisplays();
  updateStatus();
}

function toggleTilePlayPause(index, shouldRecord) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  flashControl(tileEls[index]?.perfPlayBtn);
  const current =
    typeof tile.desiredClipPlaying === "boolean" ? tile.desiredClipPlaying : Boolean(tile.isClipPlaying);
  const next = !current;
  const action = next ? { type: "play" } : { type: "pause" };
  tile.desiredClipPlaying = next;
  triggerAction(index, action, shouldRecord);
  tile.isClipPlaying = next;
  updateTileDisplays();
}

function applySelectedCueVolume(index) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  const cueIndex = index === state.selectedIndex ? state.selectedCue : 0;
  const cueVolume = clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100);
  const master = clamp(tile.masterVolume ?? 100, 0, 100);
  const volume = clamp((cueVolume * master) / 100, 0, 100);
  player.setVolume?.(volume);
}

function pauseAllVideos() {
  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.pauseVideo) {
      tile.player.pauseVideo();
      tile.isClipPlaying = false;
      tile.desiredClipPlaying = false;
    }
  });
  updateTileDisplays();
}

function playAllVideos() {
  state.tiles.forEach((tile, idx) => {
    if (tile.player && tile.player.playVideo) {
      tile.player.playVideo();
      tile.isClipPlaying = true;
      tile.desiredClipPlaying = true;
      ensureTilePlaying(idx, PLAY_RETRY_COUNT);
    }
  });
  updateTileDisplays();
}

function saveToUrl() {
  // Session persistence is hash-based so a single URL fully reproduces state
  // without requiring a backend.
  const payload = {
    bpm: state.bpm,
    isEditMode: state.isEditMode,
    selectedIndex: state.selectedIndex,
    selectedCue: state.selectedCue,
    tiles: state.tiles.map((tile) => ({
      videoUrl: tile.videoUrl,
      videoPool: parsePoolKey(tile.videoPool),
      videoHistory: Array.isArray(tile.videoHistory) ? tile.videoHistory.slice(-50) : [],
      cues: tile.cues,
      cueVolumes: tile.cueVolumes,
      cueShifts: tile.cueShifts,
      masterVolume: tile.masterVolume,
      playbackRate: tile.playbackRate,
      actions: tile.actions,
      steps: tile.steps,
      division: tile.division,
      customCues: tile.customCues,
    })),
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  window.history.replaceState({}, "", `#${encoded}`);
}

function loadFromUrl() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;
  try {
    // Backward-compatible parse: tolerate missing fields and fill defaults.
    const decoded = decodeURIComponent(atob(hash));
    const payload = JSON.parse(decoded);
    if (payload && payload.tiles) {
      state.bpm = payload.bpm || 120;
      state.isEditMode = payload.isEditMode !== false;
      state.selectedIndex = payload.selectedIndex || 0;
      state.selectedCue = payload.selectedCue || 0;
      const legacyPool = parsePoolKey(payload.videoPool);
      state.tiles = payload.tiles.map((tile) => normalizeTileState(tile, legacyPool));
      state.tiles = state.tiles.concat(
        Array.from({ length: TILE_COUNT - state.tiles.length }, () => getDefaultTileState())
      );
      const hasComposition = state.tiles.some(
        (tile) => tile.videoUrl || tile.actions.some((step) => (step || []).length > 0)
      );
      if (hasComposition) {
        state.isEditMode = false;
      }
    }
  } catch (error) {
    console.warn("Failed to load state from URL", error);
  }

  bpmInput.value = state.bpm;
  state.division = state.division || BASE_DIVISION;
}

function parseVideoId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : "";
}

function parsePlaylistId(url) {
  if (!url) return "";
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}

function adjustCueVolumeFromArrow(key) {
  const tile = state.tiles[state.selectedIndex];
  const cueIndex = state.selectedCue;
  const current = clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100);
  let delta = 0;
  if (key === "ArrowLeft") delta = -1;
  if (key === "ArrowRight") delta = 1;
  if (key === "ArrowUp") delta = 10;
  if (key === "ArrowDown") delta = -10;
  tile.cueVolumes[cueIndex] = clamp(current + delta, 0, 100);
  updateTileDisplays();
  flashControl(tileEls[state.selectedIndex]?.cueVolInput);
  saveToUrl();
  pushHistorySnapshot();
}

function startNewSession() {
  stopTransport();
  state.bpm = 120;
  state.isPlaying = false;
  state.isRecording = false;
  state.isEditMode = true;
  state.globalStep = 0;
  state.selectedIndex = 0;
  state.selectedCue = 0;
  state.selectedStep = null;
  metronomeEnabled = false;
  metronomeToggleBtn?.classList.remove("active");
  metronomeVolume = 50;
  if (metronomeVolumeInput) metronomeVolumeInput.value = "50";
  stopMetronome();
  state.tiles = Array.from({ length: TILE_COUNT }, () => {
    const tile = getDefaultTileState();
    tile.videoPool = getRandomPoolKey();
    return tile;
  });
  bpmInput.value = "120";
  window.history.pushState({}, "", `?s=${Math.random().toString(36).slice(2, 10)}`);
  buildGrid();
  updateTransportButton();
  saveToUrl();
  resetHistory();
}

function getRandomPoolKey() {
  if (!VIDEO_POOL_OPTIONS.length) return "top_hits";
  const idx = Math.floor(Math.random() * VIDEO_POOL_OPTIONS.length);
  const key = VIDEO_POOL_OPTIONS[idx]?.key;
  return key in RANDOM_VIDEO_POOLS ? key : "top_hits";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function flashControl(element) {
  if (!element) return;
  element.classList.remove("value-flash");
  void element.offsetWidth;
  element.classList.add("value-flash");
  setTimeout(() => {
    element.classList.remove("value-flash");
  }, 240);
}

function setTooltip(element, text) {
  if (!element) return;
  element.dataset.tooltip = text;
  element.removeAttribute("title");
}

function initTooltips() {
  // Custom tooltip allows controlled delay and multiline shortcut hints;
  // native title tooltips do not support this behavior consistently.
  tooltipEl = document.createElement("div");
  tooltipEl.className = "app-tooltip";
  tooltipEl.setAttribute("aria-hidden", "true");
  document.body.appendChild(tooltipEl);

  document.addEventListener("mouseover", handleTooltipOver);
  document.addEventListener("mouseout", handleTooltipOut);
  document.addEventListener("scroll", hideTooltip, true);
  document.addEventListener("keydown", hideTooltip, true);
  document.addEventListener("mousedown", hideTooltip, true);
  window.addEventListener("resize", hideTooltip);
}

function handleTooltipOver(event) {
  const target = event.target?.closest?.("[data-tooltip]");
  if (!target) {
    hideTooltip();
    return;
  }
  if (tooltipTarget === target) return;
  hideTooltip();
  tooltipTarget = target;
  tooltipTimer = setTimeout(() => {
    if (!tooltipTarget || !tooltipEl) return;
    tooltipEl.textContent = tooltipTarget.dataset.tooltip || "";
    tooltipEl.classList.add("show");
    tooltipEl.setAttribute("aria-hidden", "false");
    positionTooltip(tooltipTarget);
  }, 500);
}

function handleTooltipOut(event) {
  if (!tooltipTarget) return;
  if (tooltipTarget.contains(event.relatedTarget)) return;
  hideTooltip();
}

function positionTooltip(target) {
  if (!tooltipEl || !target) return;
  const rect = target.getBoundingClientRect();
  const tipRect = tooltipEl.getBoundingClientRect();
  const top = Math.min(window.innerHeight - tipRect.height - 8, rect.bottom + 8);
  const centeredLeft = rect.left + rect.width / 2 - tipRect.width / 2;
  const left = Math.max(8, Math.min(centeredLeft, window.innerWidth - tipRect.width - 8));
  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.left = `${left}px`;
}

function hideTooltip() {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
  }
  tooltipTarget = null;
  if (!tooltipEl) return;
  tooltipEl.classList.remove("show");
  tooltipEl.setAttribute("aria-hidden", "true");
}

window.onYouTubeIframeAPIReady = () => {
  recreatePlayers();
};

init();

function recreatePlayers() {
  if (!window.YT || !window.YT.Player) return;
  state.tiles.forEach((tile, idx) => {
    const videoId = tile.videoId || parseVideoId(tile.videoUrl || "");
    const playlistId = parsePlaylistId(tile.videoUrl || "");
    if (videoId || playlistId) {
      const playerVars = {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
      };
      if (playlistId && !videoId) {
        playerVars.listType = "playlist";
        playerVars.list = playlistId;
      }
      tile.player = new window.YT.Player(`player-${idx}`, {
        videoId: videoId || undefined,
        playerVars,
        events: {
          onReady: () => maybeSetDefaultCues(idx),
          onStateChange: (event) => handlePlayerState(idx, event),
        },
      });
    }
  });
}

function maybeSetDefaultCues(index) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  tile.player?.setPlaybackRate?.(tile.playbackRate ?? 1);
  applySelectedCueVolume(index);
  queueDefaultCues(index);
}

function queueDefaultCues(index, triesLeft = 30) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!tile || !player) return;
  if (tile.customCues) return;
  if (tile.cues.some((cue) => cue > 0)) return;

  const duration = player.getDuration?.() || 0;
  if (duration > 0) {
    // Default cue strategy: 10 evenly spaced points from start to near end.
    const slice = duration / 10;
    for (let i = 0; i < 10; i += 1) {
      tile.cues[i] = slice * i;
    }
    updateTileDisplays();
    saveToUrl();
    return;
  }

  if (triesLeft > 0) {
    setTimeout(() => queueDefaultCues(index, triesLeft - 1), 150);
  }
}

function handlePlayerState(index, event) {
  const tile = state.tiles[index];
  if (!tile) return;
  const ytState = event?.data;
  if (ytState === window.YT?.PlayerState?.PLAYING) {
    tile.isClipPlaying = true;
    if (tile.desiredClipPlaying === true) tile.desiredClipPlaying = null;
    tile.player?.setPlaybackRate?.(tile.playbackRate ?? 1);
  } else if (
    ytState === window.YT?.PlayerState?.PAUSED ||
    ytState === window.YT?.PlayerState?.ENDED
  ) {
    tile.isClipPlaying = false;
    if (tile.desiredClipPlaying === false) tile.desiredClipPlaying = null;
  }
  updateTileDisplays();
}

function tapTempo() {
  const now = performance.now();
  tapTimes = tapTimes.filter((t) => now - t < 3000);
  tapTimes.push(now);
  if (tapTimes.length < 2) return;
  const intervals = [];
  for (let i = 1; i < tapTimes.length; i += 1) {
    intervals.push(tapTimes[i] - tapTimes[i - 1]);
  }
  const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  if (!Number.isFinite(avg) || avg <= 0) return;
  state.bpm = clamp(Math.round(60000 / avg), 40, 240);
  bpmInput.value = String(state.bpm);
  if (state.isPlaying) {
    const interval = getBaseTickMs();
    if (transportTimer) clearInterval(transportTimer);
    transportTimer = setInterval(tick, interval);
  }
  saveToUrl();
  updateStatus();
}

function rebuildTileSteps(index) {
  const entry = tileEls[index];
  const tileState = state.tiles[index];
  if (!entry || !tileState) return;
  const { stepIndicator } = entry;
  stepIndicator.innerHTML = "";
  stepIndicator.style.gridTemplateColumns = `repeat(${tileState.steps}, minmax(0, 1fr))`;
  const stepDots = [];
  for (let s = 0; s < tileState.steps; s += 1) {
    const dot = document.createElement("div");
    dot.className = "step";
    if (s % 4 === 0) dot.classList.add("beat-step");
    dot.dataset.step = String(s);
    dot.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTile(index);
      toggleSelectedStep(s);
    });
    stepIndicator.appendChild(dot);
    stepDots.push(dot);
  }
  entry.stepDots = stepDots;
  stepEls[index] = stepDots;
  updateTileDisplays();
}

function resizeActions(tile) {
  const totalSteps = tile.steps;
  if (totalSteps < 1) tile.steps = 1;
  const next = Array.from({ length: totalSteps }, (_, idx) => tile.actions[idx] || []);
  tile.actions = next;
}

function getLocalStep(tile) {
  const totalSteps = tile.steps;
  const stepAdvance = getStepAdvance(tile);
  if (totalSteps <= 0) return 0;
  return Math.floor(state.globalStep / stepAdvance) % totalSteps;
}

function getStepDurationMs(tile) {
  const baseInterval = getBaseTickMs();
  const stepAdvance = getStepAdvance(tile);
  return baseInterval * stepAdvance;
}

function startMetronome() {
  if (!metronomeContext) {
    metronomeContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function stopMetronome() {
  return;
}

function clickMetronome(isDownbeat = false) {
  if (!metronomeContext) return;
  const osc = metronomeContext.createOscillator();
  const gain = metronomeContext.createGain();
  osc.type = "triangle";
  osc.frequency.value = isDownbeat ? 1200 : 800;
  gain.gain.value = 0.24 * (metronomeVolume / 100);
  osc.connect(gain);
  gain.connect(metronomeContext.destination);
  const now = metronomeContext.currentTime;
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  osc.start(now);
  osc.stop(now + 0.03);
}

function flashStep(dot) {
  dot.classList.add("flash");
  setTimeout(() => {
    dot.classList.remove("flash");
  }, 200);
}

function getStepAdvance(tile) {
  return BASE_DIVISION / (tile.division || BASE_DIVISION);
}

function getBaseTickMs() {
  return (60 / state.bpm) * (4 / BASE_DIVISION) * 1000;
}

function getHistorySnapshot() {
  // Undo/redo snapshots intentionally exclude player objects and URLs.
  // They only capture editable musical state and selection context.
  return {
    bpm: state.bpm,
    selectedIndex: state.selectedIndex,
    selectedCue: state.selectedCue,
    selectedStep: state.selectedStep,
    tiles: state.tiles.map((tile) => ({
      cues: tile.cues.slice(),
      cueVolumes: tile.cueVolumes.slice(),
      cueShifts: tile.cueShifts.slice(),
      masterVolume: tile.masterVolume,
      playbackRate: tile.playbackRate,
      actions: tile.actions.map((step) => (step || []).map((action) => ({ ...action }))),
      steps: tile.steps,
      division: tile.division,
      customCues: tile.customCues,
    })),
  };
}

function snapshotEquals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pushHistorySnapshot() {
  if (isApplyingHistory) return;
  const next = getHistorySnapshot();
  const prev = historyPast[historyPast.length - 1];
  if (prev && snapshotEquals(prev, next)) return;
  historyPast.push(next);
  if (historyPast.length > 200) historyPast.shift();
  historyFuture = [];
}

function resetHistory() {
  historyPast = [getHistorySnapshot()];
  historyFuture = [];
}

function applyHistorySnapshot(snapshot) {
  if (!snapshot) return;
  // Guard re-entrant writes so applying history does not create new snapshots.
  isApplyingHistory = true;
  state.bpm = clamp(Number(snapshot.bpm) || 120, 40, 240);
  bpmInput.value = String(state.bpm);
  state.selectedIndex = clamp(Number(snapshot.selectedIndex) || 0, 0, TILE_COUNT - 1);
  state.selectedCue = clamp(Number(snapshot.selectedCue) || 0, 0, 9);
  state.selectedStep =
    snapshot.selectedStep === null || snapshot.selectedStep === undefined
      ? null
      : Number.isNaN(Number(snapshot.selectedStep))
        ? null
        : Number(snapshot.selectedStep);

  snapshot.tiles.forEach((tileSnap, idx) => {
    const tile = state.tiles[idx];
    if (!tile || !tileSnap) return;
    tile.cues = Array.isArray(tileSnap.cues) ? tileSnap.cues.slice(0, 10) : tile.cues;
    while (tile.cues.length < 10) tile.cues.push(0);
    tile.cueVolumes = Array.isArray(tileSnap.cueVolumes) ? tileSnap.cueVolumes.slice(0, 10) : tile.cueVolumes;
    while (tile.cueVolumes.length < 10) tile.cueVolumes.push(100);
    tile.cueShifts = Array.isArray(tileSnap.cueShifts) ? tileSnap.cueShifts.slice(0, 10) : tile.cueShifts;
    while (tile.cueShifts.length < 10) tile.cueShifts.push(0);
    tile.masterVolume = clamp(Number(tileSnap.masterVolume) || 100, 0, 100);
    tile.playbackRate = Number(tileSnap.playbackRate) || 1;
    tile.steps = clamp(Number(tileSnap.steps) || 16, 1, 128);
    tile.division = Number(tileSnap.division) || BASE_DIVISION;
    tile.customCues = Boolean(tileSnap.customCues);
    tile.pendingActionTimers = [];
    tile.actions = Array.from({ length: tile.steps }, (_, stepIdx) => {
      const row = (tileSnap.actions && tileSnap.actions[stepIdx]) || [];
      return row.map((action) => ({ ...action }));
    });
    if (tileEls[idx]?.stepDots?.length !== tile.steps) {
      rebuildTileSteps(idx);
    }
  });

  tileEls.forEach((entry, idx) => {
    entry.tile.classList.toggle("selected", idx === state.selectedIndex);
  });
  updateTileDisplays();
  saveToUrl();
  isApplyingHistory = false;
}

function undoHistory() {
  if (historyPast.length <= 1) return;
  const current = historyPast.pop();
  historyFuture.push(current);
  const prev = historyPast[historyPast.length - 1];
  applyHistorySnapshot(prev);
}

function redoHistory() {
  if (!historyFuture.length) return;
  const next = historyFuture.pop();
  historyPast.push(next);
  applyHistorySnapshot(next);
}

function showShareHint(text) {
  if (!shareHint) return;
  shareHint.textContent = text;
  shareHint.classList.add("show");
}

function hideShareHint() {
  if (!shareHint || !shareHint.classList.contains("show")) return;
  shareHint.classList.remove("show");
}

function setShowcaseOpen(open) {
  showcaseSidebar?.classList.toggle("show", open);
  showcaseBackdrop?.classList.toggle("show", open);
  showcaseSidebar?.setAttribute("aria-hidden", open ? "false" : "true");
  showcaseBackdrop?.setAttribute("aria-hidden", open ? "false" : "true");
}

function setCommunityOpen(open) {
  communityPanel?.classList.toggle("show", open);
  communityPanel?.setAttribute("aria-hidden", open ? "false" : "true");
}

function addShowcaseLink(name, url) {
  if (!isValidSessionUrl(url)) {
    statusEl.textContent = "Please enter a valid session URL.";
    return;
  }
  showcaseLinks.unshift({ name, url });
  saveShowcaseLinks();
  renderShowcaseLinks();
  if (showcaseNameInput) showcaseNameInput.value = "";
  if (showcaseUrlInput) showcaseUrlInput.value = "";
}

function removeShowcaseLink(index) {
  showcaseLinks.splice(index, 1);
  saveShowcaseLinks();
  renderShowcaseLinks();
}

function renameShowcaseLink(index) {
  const current = showcaseLinks[index];
  if (!current) return;
  const next = window.prompt("Rename session:", current.name || `Session ${index + 1}`);
  if (next === null) return;
  const trimmed = next.trim();
  if (!trimmed) return;
  showcaseLinks[index] = { ...current, name: trimmed };
  saveShowcaseLinks();
  renderShowcaseLinks();
}

function renderShowcaseLinks() {
  if (!showcaseList) return;
  if (!showcaseLinks.length) {
    showcaseList.innerHTML = '<div class="showcase-item">No links yet. Add one above.</div>';
    return;
  }
  showcaseList.innerHTML = "";
  showcaseLinks.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "showcase-item";

    const title = document.createElement("div");
    title.className = "showcase-item-title";
    title.textContent = item.name || `Session ${index + 1}`;

    const actions = document.createElement("div");
    actions.className = "showcase-item-row";

    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.textContent = "Load Session";
    loadBtn.addEventListener("click", () => {
      window.location.href = item.url;
    });

    const openNewTabBtn = document.createElement("button");
    openNewTabBtn.type = "button";
    openNewTabBtn.textContent = "Open In New Tab";
    openNewTabBtn.addEventListener("click", () => {
      window.open(item.url, "_blank", "noopener,noreferrer");
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeShowcaseLink(index));

    const renameBtn = document.createElement("button");
    renameBtn.type = "button";
    renameBtn.textContent = "Rename";
    renameBtn.addEventListener("click", () => renameShowcaseLink(index));

    actions.append(loadBtn, openNewTabBtn, renameBtn, removeBtn);
    row.append(title, actions);
    showcaseList.appendChild(row);
  });
}

function generateSessionName() {
  const words = [];
  state.tiles.forEach((tile) => {
    const title = tile.player?.getVideoData?.()?.title || "";
    if (!title) return;
    const token = title
      .replace(/\[[^\]]*\]|\([^\)]*\)/g, " ")
      .split(/[^a-zA-Z0-9]+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 4);
    if (token.length) {
      words.push(token[Math.floor(Math.random() * token.length)]);
    }
  });
  if (!words.length) {
    return `Session ${showcaseLinks.length + 1}`;
  }
  const unique = Array.from(new Set(words));
  const picked = unique.slice(0, 3);
  return picked.join(" ");
}

function renderCommunityPanelLinks() {
  if (!communityPopupList) return;
  if (communityDiscordLink) {
    communityDiscordLink.href = COMMUNITY_DISCORD_URL;
  }
  if (!COMMUNITY_SESSIONS.length) {
    communityPopupList.innerHTML = '<div class="showcase-item">No community sessions yet.</div>';
    return;
  }
  communityPopupList.innerHTML = "";
  COMMUNITY_SESSIONS.forEach((item, index) => {
    if (!isValidSessionUrl(item.url)) return;
    const row = document.createElement("div");
    row.className = "showcase-item";

    const title = document.createElement("div");
    title.className = "showcase-item-title";
    title.textContent = item.name || `Community ${index + 1}`;

    const actions = document.createElement("div");
    actions.className = "showcase-item-row";
    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.textContent = "Load Session";
    loadBtn.addEventListener("click", () => {
      window.location.href = item.url;
    });
    const openNewTabBtn = document.createElement("button");
    openNewTabBtn.type = "button";
    openNewTabBtn.textContent = "Open In New Tab";
    openNewTabBtn.addEventListener("click", () => {
      window.open(item.url, "_blank", "noopener,noreferrer");
    });
    actions.append(loadBtn, openNewTabBtn);

    row.append(title, actions);
    communityPopupList.appendChild(row);
  });
}

function saveShowcaseLinks() {
  try {
    window.localStorage.setItem("choptube_showcase_links", JSON.stringify(showcaseLinks.slice(0, 40)));
  } catch (error) {
    console.warn("Could not save showcase links", error);
  }
}

function loadShowcaseLinks() {
  try {
    const raw = window.localStorage.getItem("choptube_showcase_links");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      showcaseLinks = parsed
        .filter((item) => item && typeof item.url === "string" && isValidSessionUrl(item.url))
        .map((item) => ({ name: String(item.name || "Session"), url: item.url }));
    }
  } catch (error) {
    console.warn("Could not load showcase links", error);
  }
}

function isValidSessionUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function isMobileClient() {
  const ua = navigator.userAgent || "";
  const mobileUA = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(ua);
  const smallScreen = window.matchMedia("(max-width: 900px)").matches;
  const touchDevice = window.matchMedia("(pointer: coarse)").matches;
  return mobileUA || (smallScreen && touchDevice);
}

function updateMobileBlocker() {
  if (!mobileBlocker) return;
  const blocked = isMobileClient();
  mobileBlocker.classList.toggle("show", blocked);
  mobileBlocker.setAttribute("aria-hidden", blocked ? "false" : "true");
}

function ensureTilePlaying(index, triesLeft) {
  if (!state.isPlaying || triesLeft <= 0) return;
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  const playerState = player.getPlayerState?.();
  const isPlaying =
    playerState === window.YT?.PlayerState?.PLAYING || playerState === window.YT?.PlayerState?.BUFFERING;
  if (isPlaying) return;
  setTimeout(() => {
    if (!state.isPlaying) return;
    player.playVideo?.();
    ensureTilePlaying(index, triesLeft - 1);
  }, PLAY_RETRY_DELAY_MS);
}
