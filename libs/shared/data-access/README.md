# @mfe/shared/data-access

Signal-based stores (`CartStore`, `OrderStore`, `UserStore`) shared across microfrontends.

Because the lib is a path mapping in `tsconfig.base.json`, Native Federation shares it as a **singleton** –
the shell and all remotes get the same instance at runtime. Keep the public API backwards compatible:
the version that loads first (the shell's) wins.

Owned by Team Platform. May only depend on `type:util` libs.
