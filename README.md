# Cascading Merge

Automatically merge branches in to each other when a base branch changes

## Usage

```yaml
name: Cascading Merge
on:
  push:
    branches:
      - branch-0
      - branch-1
      - branch-2
      - branch-3

jobs:
  cascading-merge:
    name: Cascading Merge
    runs-on: ubuntu-latest
    steps:
      - name: Cascading Merge
        uses: mheap/cascading-merge-action@v1
        with:
          # Changes to `branch-1` will automatically be merged into `branch-2` and `branch-3`
          branches: |
            branch-0
            branch-1
            branch-2
            branch-3
```

## Available Configuration

### Inputs

| Name       | Description                                                                                     | Required | Default             |
| ---------- | ----------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `token`    | The GITHUB_TOKEN to use                                                                         | true     | ${{ github.token }} |
| `branches` | The branches to merge, one per line. The branches at the top will be merged into lower branches | true     |
