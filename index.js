const core = require("@actions/core");
const github = require("@actions/github");

async function action() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // If it's not a push event, there's no work to do
    if (github.context.eventName !== "push") {
      console.log("Triggered on non-push event. Exiting.");
      return;
    }

    const octokit = github.getOctokit(
      core.getInput("token", { required: true })
    );

    // Trim branches input and convert to list
    const sourceBranches = core
      .getInput("branches", { required: true })
      .split("\n")
      .map((branch) => branch.trim());

    // Work out which branch triggered this run
    const triggerBranch = github.context.ref.replace("refs/heads/", "");

    // Is it in our list of branches?
    if (!sourceBranches.includes(triggerBranch)) {
      console.log(
        `${triggerBranch} does not trigger an automatic merge for this action`
      );
      return;
    }

    // Remove any branches that appear in the heirarchy before the trigger branch
    const activeBranches = sourceBranches.slice(
      sourceBranches.indexOf(triggerBranch) + 1
    );
    console.log(activeBranches);

    // Merge the trigger branch into each of these branches

    for (let index in activeBranches) {
      const active = activeBranches[index];
      let previous = activeBranches[index - 1];
      if (!previous) {
        previous = triggerBranch;
      }

      try {
        console.log(`Merging ${previous} in to ${active}`);
        await octokit.rest.repos.merge({
          owner,
          repo,
          base: active,
          head: previous,
        });
      } catch (e) {
        console.log(e);
        return core.setFailed(`Unable to merge ${previous} in to ${active}`);
      }
    }
  } catch (e) {
    if (e.request && e.request.url) {
      return core.setFailed(
        `Error fetching ${e.request.url} - HTTP ${e.status}`
      );
    }
    return core.setFailed(e.message);
  }
}

if (require.main === module) {
  action();
}

module.exports = action;
