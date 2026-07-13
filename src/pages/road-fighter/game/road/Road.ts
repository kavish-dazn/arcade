class Road {
    // private width = 0;
    private height = 0;

    private roadWidth = 0;
    private roadLeft = 0;

    private roadOffset = 0;

    resize(width: number, height: number) {
        // this.width = width;
        this.height = height;

        this.roadWidth = Math.min(width * 0.68, height * 1.1);
        this.roadLeft = (width - this.roadWidth) / 2;
    }

    update(deltaSeconds: number) {
        const roadSpeed = this.height * 0.72;

        this.roadOffset = (this.roadOffset + roadSpeed * deltaSeconds) % this.getLaneDashPeriod();
    }

    getRoadWidth() {
        return this.roadWidth;
    }

    getHeight() {
        return this.height;
    }

    getRoadLeft() {
        return this.roadLeft;
    }

    getRoadOffset() {
        return this.roadOffset;
    }

    getRoadSpeed() {
        return this.height * 0.72;
    }

    getShoulderWidth() {
        return Math.max(16, this.roadWidth * 0.045);
    }

    getLaneDashHeight() {
        return Math.max(24, this.height * 0.07);
    }

    getLaneDashPeriod() {
        return this.getLaneDashHeight() * 1.8;
    }
}

export default Road;
