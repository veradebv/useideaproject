import { Sandbox } from '@e2b/code-interpreter';

export interface SandboxBuildResult {
  success: boolean;
  previewUrl: string;
  sandboxId: string;
  errorLog?: string;
}

export async function provisionAndBuildSite(
  files: Record<string, string>,
  existingSandboxId?: string
): Promise<SandboxBuildResult> {
  const sbx = existingSandboxId
    ? await Sandbox.connect(existingSandboxId)
    : await Sandbox.create(process.env.E2B_NEXTJS_TEMPLATE_ID || 'base', {
        timeoutMs: 10 * 60 * 1000,
      });

  for (const [filePath, content] of Object.entries(files)) {
    await sbx.files.write(filePath, content);
  }

  const buildCheck = await sbx.commands.run('npm run build', {
    cwd: '/home/user/app',
  });

  if (buildCheck.exitCode !== 0) {
    return {
      success: false,
      previewUrl: '',
      sandboxId: sbx.sandboxId,
      errorLog: buildCheck.stderr || buildCheck.stdout,
    };
  }

  await sbx.commands.run('nohup npm run start -- -p 3000 > /tmp/next.log 2>&1 &', {
    cwd: '/home/user/app',
  });

  return {
    success: true,
    previewUrl: `https://${sbx.getHost(3000)}`,
    sandboxId: sbx.sandboxId,
  };
}
