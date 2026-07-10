class LaneManager {
    static readonly LANE_COUNT = 3;

    private roadLeft = 0;

    private roadWidth = 0;

    private laneWidth = 0;

    private centers: number[] = [];

    resize(roadLeft: number, roadWidth: number) {
        this.roadLeft = roadLeft;
        this.roadWidth = roadWidth;

        this.laneWidth = roadWidth / LaneManager.LANE_COUNT;

        this.centers = [
            roadLeft + this.laneWidth * 0.5,
            roadLeft + this.laneWidth * 1.5,
            roadLeft + this.laneWidth * 2.5,
        ];
    }

    getCenter(index: number) {
        return this.centers[index];
    }

    getCenters() {
        return this.centers;
    }

    getLaneWidth() {
        return this.laneWidth;
    }

    getRoadLeft() {
        return this.roadLeft;
    }

    getRoadWidth() {
        return this.roadWidth;
    }

    getLaneCount() {
        return this.centers.length;
    }
}

export default LaneManager;
