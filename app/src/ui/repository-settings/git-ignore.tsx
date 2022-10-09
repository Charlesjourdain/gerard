import * as React from 'react'
import { DialogContent } from '../dialog'
import { TextArea } from '../lib/text-area'
import { LinkButton } from '../lib/link-button'
import { Ref } from '../lib/ref'
import { getGitIgnoreNames, getGitIgnoreText } from '../add-repository/gitignores'
import { Button } from '../lib/button'
import { IMenuItem, showContextualMenu } from '../../lib/menu-item'
import { Octicon } from '../octicons/octicon'
import * as OcticonSymbol from '../octicons/octicons.generated'
import { Row } from '../lib/row'

interface IGitIgnoreProps {
  readonly text: string | null
  readonly onIgnoreTextChanged: (text: string) => void
  readonly onShowExamples: () => void
}

interface IGitIgnoreState {
  /** The names for the available gitignores. */
  readonly gitIgnoreNames: ReadonlyArray<string> | null
}

/** A view for creating or modifying the repository's gitignore file */
export class GitIgnore extends React.Component<IGitIgnoreProps, IGitIgnoreState> {
  public constructor(props: IGitIgnoreProps) {
    super(props)

    this.state = {
      gitIgnoreNames: null,
    }
  }

  public async componentDidMount() {
    const gitIgnoreNames = await getGitIgnoreNames()

    this.setState({ gitIgnoreNames })
  }

  private onIgnoreTemplateSelected = async (templateName: string) => {
    const templateText = await getGitIgnoreText(templateName)
    this.props.onIgnoreTextChanged(templateText)
  }

  private onUseTemplateButtonClick = () => {
    const gitIgnores = this.state.gitIgnoreNames || []
    const items: IMenuItem[] = gitIgnores.map(n => ({
      label: n,
      action: () => this.onIgnoreTemplateSelected(n),
    }))
    showContextualMenu(items)
  }

  public render() {
    return (
      <DialogContent>
        <p>
          Editing <Ref>.gitignore</Ref>. This file specifies intentionally
          untracked files that Git should ignore. Files already tracked by Git
          are not affected.{' '}
          <LinkButton onClick={this.props.onShowExamples}>
            Learn more
          </LinkButton>
        </p>

        <Row>
          <Button
            onClick={this.onUseTemplateButtonClick}
          >
            Use Template
            <Octicon symbol={OcticonSymbol.triangleDown} />
          </Button>
        </Row>

        <TextArea
          placeholder="Ignored files"
          value={this.props.text || ''}
          onValueChanged={this.props.onIgnoreTextChanged}
          rows={6}
        />
      </DialogContent>
    )
  }
}
