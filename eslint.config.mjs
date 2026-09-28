import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
      "ignores": [
        "**/dist",
        "**/out-tsc",
        "**/vitest.config.*.timestamp*"
      ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    // Team boundaries: a team may use shared libs and its own scope – never another team's code.
                    depConstraints: [
                        { sourceTag: "scope:shared", onlyDependOnLibsWithTags: ["scope:shared"] },
                        { sourceTag: "scope:shell", onlyDependOnLibsWithTags: ["scope:shared", "scope:shell"] },
                        { sourceTag: "scope:insights", onlyDependOnLibsWithTags: ["scope:shared", "scope:insights"] },
                        { sourceTag: "scope:products", onlyDependOnLibsWithTags: ["scope:shared", "scope:products"] },
                        { sourceTag: "scope:cart", onlyDependOnLibsWithTags: ["scope:shared", "scope:cart"] },
                        { sourceTag: "scope:orders", onlyDependOnLibsWithTags: ["scope:shared", "scope:orders"] },
                        { sourceTag: "scope:profile", onlyDependOnLibsWithTags: ["scope:shared", "scope:profile"] },
                        { sourceTag: "scope:layout-api", onlyDependOnLibsWithTags: ["scope:shared"] },
                        // Layering: ui/data-access build on util, util depends on nothing.
                        { sourceTag: "type:app", onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
                        { sourceTag: "type:feature", onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
                        { sourceTag: "type:ui", onlyDependOnLibsWithTags: ["type:ui", "type:util"] },
                        { sourceTag: "type:data-access", onlyDependOnLibsWithTags: ["type:data-access", "type:util"] },
                        { sourceTag: "type:util", onlyDependOnLibsWithTags: ["type:util"] }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
