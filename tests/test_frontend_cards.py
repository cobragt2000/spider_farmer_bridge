"""Guard the single-bundle card serving (PPFD folded into spider-farmer-card).

Since 3.19.193 the PPFD card is defined by the one spider-farmer-card.js bundle
instead of a separate ppfd-3d-card.js. These cheap checks stop a future change
from silently reintroducing the dual-file loading race.
"""
import os

from custom_components.sf import frontend

_CARDS_DIR = os.path.join(
    os.path.dirname(frontend.__file__), "cards"
)


def test_only_single_bundle_served():
    assert frontend.CARD_FILES == ("spider-farmer-card.js",)
    # The retired standalone file must be listed as legacy (so it gets purged).
    assert "ppfd-3d-card.js" in frontend.LEGACY_CARD_FILES


def test_legacy_ppfd_file_removed_from_bundle_dir():
    # The old hand-written card must no longer ship in the package.
    assert not os.path.isfile(os.path.join(_CARDS_DIR, "ppfd-3d-card.js"))


def test_bundle_defines_every_card():
    js = open(
        os.path.join(_CARDS_DIR, "spider-farmer-card.js"), encoding="utf-8"
    ).read()
    for tag in ("spider-farmer-card", "spider-light-card", "ppfd-3d-card"):
        assert tag in js, f"bundle is missing the {tag} element"
