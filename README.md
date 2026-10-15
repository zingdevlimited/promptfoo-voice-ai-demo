# Promptfoo Voice AI Demo

> [!WARNING]
> **Test code only. Not for production use.**
>
> Zing is sharing this repository as an example of how prompt evaluations can be set up for a voice AI agent. It has not been reviewed, hardened or confirmed as valid for production use. Use it as a reference only, at your own risk, and validate any approach against your own requirements before relying on it.

Example [promptfoo](https://www.promptfoo.dev/) evaluation suite for a voice AI customer validation agent, running against a model deployed on Azure AI Foundry.

The agent collects and validates, in order:

1. Consent
2. First line of address
3. Postcode
4. Date of birth

The evals check whether the agent correctly accepts a valid answer (moves on to the next field) or rejects an invalid one (stays on the current field).

## How it works

| Path | Purpose |
| --- | --- |
| `prompts/customer-validation.txt` | System prompt under test |
| `evals/customer-validation/promptfooconfig.yaml` | Promptfoo config: provider, prompt, tests |
| `evals/customer-validation/conversation-prompt.txt` | Chat template that replays prior turns in the same conversation |
| `evals/customer-validation/test-data.ts` | Test cases: field, spoken value, expected `accept` or `reject` |
| `evals/customer-validation/generate-tests.ts` | Builds multi-turn conversations from the test data |
| `evals/customer-validation/field-validation.ts` | Assertion: checks whether the reply progressed or stayed on the field |
| `.github/workflows/prompt-evals.yml` | CI workflow that runs the evals and posts a summary |

Each test case becomes its own conversation. Setup turns (consent, plus a valid address and postcode where needed) get the agent to the field under test, then the final turn sends the test value and asserts on the reply. Setup turns carry no assertions.

The assertion is a keyword heuristic on the reply text, not a structured check, so expect some false positives and negatives.

## Prerequisites

- Node.js 24
- An Azure AI Foundry deployment that supports the Responses API

## Setup

```sh
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
| --- | --- |
| `FOUNDRY_API_HOST` | Resource host, e.g. `your-resource.openai.azure.com` |
| `FOUNDRY_API_KEY` | API key for the resource |
| `FOUNDRY_MODEL` | Deployment name |

## Usage

```sh
npm run eval        # type-check, then run the evals
npm run eval:view   # open the promptfoo results viewer
```

## Adding test cases

Add entries to `evals/customer-validation/test-data.ts`:

```ts
{
  field: 'postcode',
  value: 'S W 1 A 1 A A',
  expected: 'accept',
},
```

`field` is one of `address`, `postcode` or `dob`. Write `value` the way a speech-to-text transcript would render it.

## CI

The workflow runs on pull requests, pushes to `main` and manual dispatch. Pull requests from forks are skipped, as they have no access to secrets.

It needs repository secrets `FOUNDRY_API_HOST`, `FOUNDRY_API_KEY` and `FOUNDRY_MODEL`. All three are secrets, not variables, so they are masked in public run logs.

The run is report-only for assertions: failed cases appear in the job summary but do not fail the build. Execution errors, or zero cases run, do fail the build. Reports are not uploaded as artifacts, because promptfoo writes the resolved provider config (including the API host) into them. Run `npm run eval` locally for the full report.

## License

[0BSD](LICENSE): use it however you like, no attribution needed. Provided as is, without warranty of any kind. See the disclaimer above.
