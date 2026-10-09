"""Export the complete Star Bound website source without secrets or build outputs."""

import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts/star-bound/public/downloads/star-bound-source.zip"
PREFIX = Path("star-bound-source")
INCLUDE = (
    "README.md", "replit.md", "LICENSE", "package.json", "pnpm-lock.yaml",
    "pnpm-workspace.yaml", "tsconfig.json", "tsconfig.base.json", ".gitignore",
    ".npmrc", ".replitignore", "artifacts/star-bound", "artifacts/api-server",
    "lib", "scripts",
)
EXCLUDE_DIRS = {
    "node_modules", ".next", "dist", ".git", "downloads", ".cache", ".local",
    "__pycache__", "coverage", "test-results", "playwright-report",
}


def safe_file(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    return (
        path.is_file()
        and not path.is_symlink()
        and path.resolve().is_relative_to(ROOT)
        and not EXCLUDE_DIRS.intersection(relative.parts)
        and not path.name.startswith(".env")
        and not path.name.endswith((".tsbuildinfo", ".pyc", ".pem", ".key"))
        and path.name not in {"AGENTS.md", "CLAUDE.md", "credentials.json"}
    )


def portable_replit_config() -> str:
    """Preserve project configuration, but never export user environment values."""
    lines = []
    omit = False
    for line in (ROOT / ".replit").read_text().splitlines():
        section = re.match(r"^\s*\[([^\]]+)\]", line)
        if section:
            omit = section.group(1).startswith("userenv")
        if not omit:
            lines.append(line)
    return "\n".join(lines).strip() + "\n"


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = OUTPUT.with_suffix(".tmp")
    try:
        with ZipFile(temporary, "w", ZIP_DEFLATED) as archive:
            for entry in INCLUDE:
                path = ROOT / entry
                if not path.exists():
                    continue
                files = [path] if path.is_file() else sorted(path.rglob("*"))
                for file in files:
                    if safe_file(file):
                        archive.write(file, PREFIX / file.relative_to(ROOT))
            archive.writestr(str(PREFIX / ".replit"), portable_replit_config())
        with ZipFile(temporary) as archive:
            if archive.testzip() is not None:
                raise RuntimeError("Source archive integrity check failed")
            count = len(archive.namelist())
        temporary.replace(OUTPUT)
        print(f"Source ZIP verified: {count} files; {OUTPUT.stat().st_size:,} bytes")
    finally:
        temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    main()