// Release of ONE app from a release or hotfix branch (docs/adr/0001-release-per-app.md).
//
//   release/<app>/<version>   cut from develop, e.g. release/mfe-ordering/1.4.0
//   hotfix/<app>/<version>    cut from the app's production tag, e.g. hotfix/mfe-ordering/1.4.1 from mfe-ordering@1.4.0
//
// Jenkins setup: a Multibranch Pipeline job on this repo with "Script Path" = tools/jenkins/release.Jenkinsfile and
// a branch filter for `release/* hotfix/*`. Only the app named in the branch is built and deployed; the rest of the
// repo on the branch is source only.
//
// Example: everything marked PLACEHOLDER (registry, deploy, credential ids) must be adapted to your environment.

// [kind, app, version], or null. @NonCPS: a regex Matcher is not serializable and must not live across steps.
@NonCPS
def parseBranch(String branch) {
  def m = branch =~ /^(release|hotfix)\/([a-z0-9-]+)\/(\d+\.\d+\.\d+)$/
  return m.matches() ? [m.group(1), m.group(2), m.group(3)] : null
}

pipeline {
  // No agent while waiting for approval: the candidate and production stages take one each.
  agent none

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
    timestamps()
  }

  environment {
    NX_NO_CLOUD = 'true'
    NX_DAEMON = 'false'
    REGISTRY_URL = 'https://registry.example.com' // PLACEHOLDER
    REGISTRY = 'registry.example.com/mfe-store'   // PLACEHOLDER
  }

  stages {
    stage('Release candidate') {
      agent { label 'docker' } // PLACEHOLDER: an agent with Node 24, Docker and git
      stages {
        stage('Resolve app and version') {
          steps {
            script {
              def parsed = parseBranch(env.BRANCH_NAME)
              if (!parsed) error("Branch '${env.BRANCH_NAME}' is not release/<app>/<version> or hotfix/<app>/<version>")
              env.KIND = parsed[0]
              env.APP = parsed[1]
              env.VERSION = parsed[2]
              env.RELEASE_TAG = "${env.APP}@${env.VERSION}"
              env.RC_IMAGE = "${env.REGISTRY}/${env.APP}:${env.VERSION}-rc.${env.BUILD_NUMBER}"
              env.IMAGE = "${env.REGISTRY}/${env.APP}:${env.VERSION}"
              // Node services build the `api` Docker target, Angular apps the `web` target.
              env.DOCKER_TARGET = env.APP.endsWith('-api') ? 'api' : 'web'
              // The commit that gets tested is the one that gets tagged, even if the branch moves on meanwhile.
              env.RC_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
              currentBuild.displayName = "${env.RELEASE_TAG} #${env.BUILD_NUMBER}"
            }
            // Multibranch checkouts often skip tags; the release rules are based on them.
            sh 'git fetch --tags --force origin'
            sh '''
              if git rev-parse -q --verify "refs/tags/$RELEASE_TAG" >/dev/null; then
                echo "$RELEASE_TAG is already released – bump the version in the branch name." && exit 1
              fi
            '''
          }
        }

        stage('Install') {
          steps {
            sh 'npm ci --no-audit --no-fund'
            sh 'npx nx show project "$APP" >/dev/null' // fails fast on a typo in the branch name
          }
        }

        stage('Shared libs guard') {
          // libs/shared/* are federation singletons: in production a remote runs against the SHELL's copy, not the
          // one it was built with. Shared lib changes the production shell doesn't have yet must be backwards
          // compatible, or the shell must be released first.
          when { expression { env.APP != 'shell' } }
          steps {
            script {
              def shellTag = sh(script: "git tag -l 'shell@*' --sort=-v:refname | head -n 1", returnStdout: true).trim()
              if (!shellTag) {
                echo 'No shell@* production tag yet – skipping the shared libs guard.'
                return
              }
              def changed = sh(
                script: "npx nx show projects --affected --base='${shellTag}' --head=HEAD --projects 'tag:scope:shared' --json",
                returnStdout: true,
              ).trim()
              if (changed == '[]') {
                echo "Shared libs match production shell ${shellTag}."
                return
              }
              echo "Shared libs changed since production shell ${shellTag}: ${changed}"
              timeout(time: 2, unit: 'HOURS') {
                input(
                  message: "${env.APP} contains shared lib changes ${changed} that production shell ${shellTag} doesn't have. " +
                    'Continue only if they are backwards compatible or the shell is released first.',
                  ok: 'They are safe – continue',
                  submitter: 'team-platform', // PLACEHOLDER: Team Platform owns the shared libs
                )
              }
            }
          }
        }

        stage('Verify') {
          steps {
            // lint + test + production build of the app; Nx builds the libs it uses first.
            sh 'npx nx run-many -t lint test build -p "$APP"'
          }
        }

        stage('Image') {
          steps {
            withDockerRegistry([url: env.REGISTRY_URL, credentialsId: 'registry']) { // PLACEHOLDER credentials
              sh '''
                docker build -f tools/docker/Dockerfile --target "$DOCKER_TARGET" --build-arg APP="$APP" -t "$RC_IMAGE" .
                docker push "$RC_IMAGE"
              '''
            }
          }
        }

        stage('Deploy to test') {
          steps {
            // PLACEHOLDER: point the test environment's service for $APP at $RC_IMAGE (kubectl, helm, Azure CLI …).
            // A remote needs nothing else: the shell picks it up via federation.manifest.json.
            sh 'echo "deploy $RC_IMAGE to test"'
          }
        }
      }
    }

    stage('Approve for production') {
      steps {
        timeout(time: 14, unit: 'DAYS') {
          input(message: "Deploy ${env.RELEASE_TAG} to production?", ok: 'Deploy')
        }
      }
    }

    stage('Production') {
      agent { label 'docker' } // PLACEHOLDER
      stages {
        stage('Deploy to production') {
          steps {
            withDockerRegistry([url: env.REGISTRY_URL, credentialsId: 'registry']) { // PLACEHOLDER credentials
              // The exact image that was tested, retagged with the release version.
              sh 'docker pull "$RC_IMAGE" && docker tag "$RC_IMAGE" "$IMAGE" && docker push "$IMAGE"'
            }
            // PLACEHOLDER: point production's service for $APP at $IMAGE.
            sh 'echo "deploy $IMAGE to production"'
          }
        }

        stage('Tag release') {
          steps {
            sshagent(['git-ssh']) { // PLACEHOLDER: credentials with push rights for tags
              sh '''
                git tag -a "$RELEASE_TAG" "$RC_COMMIT" -m "$APP $VERSION in production (Jenkins build $BUILD_NUMBER)"
                git push origin "refs/tags/$RELEASE_TAG"
              '''
            }
          }
        }

        stage('Merge back to develop') {
          steps {
            withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) { // PLACEHOLDER
              // A PR rather than a direct merge: conflicts with develop are resolved by the team, with review.
              sh '''
                gh pr create --base develop --head "$BRANCH_NAME" \
                  --title "Merge $KIND $RELEASE_TAG into develop" \
                  --body "$RELEASE_TAG is in production. Merges back the fixes made on $BRANCH_NAME." \
                || echo "PR already exists or nothing to merge."
              '''
            }
          }
        }
      }
    }
  }

  post {
    failure {
      // PLACEHOLDER: notify the owning team (Slack, mail …).
      echo "Release ${env.RELEASE_TAG} failed. It is only tagged if the 'Tag release' stage ran."
    }
  }
}
