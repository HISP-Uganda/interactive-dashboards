export const singleValueQuery = () => {
  return {
    index: "repo",
    query: {
      bool: {
        must: [
          {
            match: {
              dx: "sv6SeKroHPV D9A0afrTYPw LR8778hLH8U",
            },
          },
          {
            bool: {
              should: [
                {
                  match: {
                    daily: "${pe}",
                  },
                },
                {
                  match: {
                    weekly: "${pe}",
                  },
                },
                {
                  match: {
                    monthly: "${pe}",
                  },
                },
                {
                  match: {
                    quarterly: "${pe}",
                  },
                },
                {
                  match: {
                    yearly: "${pe}",
                  },
                },
                {
                  match: {
                    financialjuly: "${pe}",
                  },
                },
              ],
            },
          },
          {
            bool: {
              should: [
                {
                  match: {
                    level1: "${ou}",
                  },
                },
                {
                  match: {
                    level2: "${ou}",
                  },
                },
                {
                  match: {
                    level3: "${ou}",
                  },
                },
                {
                  match: {
                    level4: "${ou}",
                  },
                },
                {
                  match: {
                    level5: "${ou}",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    aggs: {
      numerator: {
        terms: {
          field: "dx.keyword",
        },
      },
    },
  };
};
