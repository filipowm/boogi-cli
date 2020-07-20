import simpleGit from 'simple-git';
import gitInfo from 'hosted-git-info';
import pathFunc from 'path';

const withGit = path => simpleGit({
   baseDir: pathFunc.isAbsolute(path) ? path : `${process.cwd()}/${path}`,
})

export const initIfNotInitialized = async (path) => {
    const git = withGit(path);
    const isInitialized = await git.checkIsRepo('root');
    if (! isInitialized) {
        git.init();
    }
}

export const commitAfterBooGiInit = async (path) => {
    withGit(path)
        .add('./*')
        .commit("feat: initialize BooGi app")
}

export const describeRemote = (path) => {
    const remotes = withGit(path).getRemotes(true);
    if (remotes.length == 1) {
        const upstream = remotes[0].refs.push;
        const details = gitInfo.fromUrl(upstream);
        return {
            hasRemote: true,
            type: details.type,
            domain: details.domain,
            project: details.project,
            user: details.user,
            url: upstream
        }
    } else if (remotes.length > 1) {
        return {
            hasRemote: true
        }
    }
    return {
        hasRemote: false
    };
}
